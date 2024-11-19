import { sequelize , Job , Contract , Profile, ContractStatus } from '../model/model';
import { Transaction, Op } from 'sequelize';
import { config } from 'dotenv';
import cron from "node-cron";
import { findById } from '../db/contract';
config()

const { JOB_BATCH_SIZE, CRON_SCHEDULE = "* 59 23 * * *" } = process.env

async function fulfillContracts() {
  console.log('Starting contract fulfillment scheduler...');
  const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ });

  let offset = 0;
  let size: number = 100;
  try {
    if (typeof JOB_BATCH_SIZE != "undefined"){
        let job_size = parseInt(JOB_BATCH_SIZE)
        size = job_size;
    }
  } catch (error) {
    
  }

  try {
    while (true) {
      // Fetch a batch of jobs that are due and not yet paid
      const jobs = await Job.findAll({
        where: {
          paymentDate: {
            [Op.lte]: new Date(), // Jobs that are due (paymentDate <= current time)
          },
          paid: false, // Jobs that haven't been paid yet
        },
        limit: size , // Limit the number of records per batch
        offset, // Start from the current offset
        transaction, // Ensure the query uses the transaction
      });

      if (jobs.length === 0) {
        console.log('No more jobs to process.');
        break;
      }
      console.log(`[+] Processing Page: ${(offset==0 ? 1 : offset/size+1)} with total Records: ${jobs.length}`)

      // Process each job in the batch
      for (const job of jobs) {
        const contract: Contract | null = await findById(job.ContractId);
        const client = await Profile.findByPk(job.clientId, { transaction });
        const contractor = await Profile.findByPk(job.contractorId, { transaction });

        if (!client || !contractor || !contract) {
          console.error(`Related profiles or contract not found for Job ID: ${job.id}`);
          continue;
        }

        // Check if the client has sufficient balance to pay
        console.log(client.balance, job.price, client.balance< job.price)
        if (client.balance < job.price) {
          console.error(`Insufficient balance for Client ID: ${client.id} for Job ID: ${job.id}`);
          continue;
        }

        // Check if contractor's balance is valid (i.e., not negative after receiving payment)
        if (contractor.balance + job.price < 0) {
          console.error(`Contractor ID: ${contractor.id} balance would go negative for Job ID: ${job.id}`);
          continue;
        }

        // Deduct the payment from client and credit the contractor
        client.balance -= job.price;
        contractor.balance += job.price;

        // Update job to mark it as paid
        job.paid = true;
        job.paymentDate = new Date();

        // Update contract status (for example, 'completed' or 'paid')
        contract.status = ContractStatus.IN_PROGRESS; 

        // Save all changes
        await client.save({ transaction });
        await contractor.save({ transaction });
        await job.save({ transaction });
        await contract.save({ transaction });

        console.log(`Job ID: ${job.id} successfully processed.`);
      }

      // Update the offset to process the next batch
      offset += size;

    }

    // Commit all changes
    await transaction.commit();
    console.log('Contract fulfillment completed successfully.');
  } catch (error) {
    console.error('Error in contract fulfillment:', error);
    await transaction.rollback();
  }
}

cron.schedule(CRON_SCHEDULE, fulfillContracts)
