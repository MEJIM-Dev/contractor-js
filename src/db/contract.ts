// repository/contractRepository.ts
import { PagedResponse, UpdateContractResult } from "../dto/types";
import { Contract, ContractCreationAttributes, sequelize } from "../model/model";
import { Transaction } from "sequelize";

export async function findById(id: number) {
  return await Contract.findByPk(id);
}

export async function findAll(page: number, pageSize: number, filters = {}) {
    const offset = (page - 1) * pageSize;
    const { rows, count } = await Contract.findAndCountAll({
      where: { ...filters },
      offset,
      limit: pageSize,
    });

    const totalPages = Math.ceil(count / pageSize)

    const response: PagedResponse<Contract> = new PagedResponse();
    response.setData(rows);
    response.setPage(page);
    response.setTotal(count);
    response.setTotalPages(totalPages)

    return response;
}

export async function createContract(data: ContractCreationAttributes) {
  return await Contract.create(data);
}

export async function updateContract(id: number, data: any, transaction?: Transaction): Promise<UpdateContractResult> {
    const isNewTransaction = !transaction;
  let currentTransaction: Transaction | null = null;

  if (isNewTransaction) {
    currentTransaction = await sequelize.transaction();
  } else {
    currentTransaction = transaction;
  }

  try {
    const [affectedCount, updatedContracts] = await Contract.update(data, {
      where: { id },
      returning: true,
      transaction: currentTransaction,
    });

    // Ensure there's only one contract being updated
    const updatedContract = updatedContracts.length === 1 ? updatedContracts[0] : null;

    if (!updatedContract) {
      throw new Error('Unexpected number of updated contracts');
    }

    if (isNewTransaction && currentTransaction) {
      await currentTransaction.commit();
    }

    return { affectedCount, updatedContract };
  } catch (error) {
    if (isNewTransaction && currentTransaction) {
      await currentTransaction.rollback();
    }
    throw error;
  }
}

export async function deleteContract(id: number, transaction?: Transaction) {
  return await Contract.destroy({ where: { id }, transaction });
}
