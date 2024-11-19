import { Transaction } from 'sequelize';
import { findById, update } from '../db/user';
import { Profile, sequelize } from '../model/model';
import { validateAmount } from '../util/app';

export async function credit(profileId: number, amount: number, transaction?: Transaction): Promise<Profile> {
    const profile = await findById(profileId);
    if (!profile) {
      throw new Error('Profile not found');
    }

    validateAmount(amount);

    profile.balance += amount;
    await update(profileId, profile);
    return profile;
}

export async function debit(profileId: number, amount: number, transaction?: Transaction): Promise<Profile> {
    const profile = await findById(profileId);
    if (!profile) {
      throw new Error('Profile not found');
    }

    validateAmount(amount);

    if (profile.balance < amount) {
      throw new Error('Insufficient balance');
    }

    profile.balance -= amount;
    await update(profileId, profile);
    return profile;
}

export async function transferFunds(creditorId: number, beneficiaryId: number, amount: number): Promise<Profile> {
    const transaction = await sequelize.transaction();

    try {
      const profile = await debit(creditorId, amount, transaction);
      await credit(beneficiaryId, amount, transaction);

      await transaction.commit();
      console.log('Funds transferred successfully');
      return profile;
    } catch (error: unknown) {
      await transaction.rollback();
      if (error instanceof Error) {
        console.error('Error:', error.message);
      } else {
        console.error('Unknown error:', error);
      }
      throw error;
    }
}