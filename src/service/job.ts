import { JobCreation, JobUpdates, PagedResponse } from "../dto/types";
import { Job, JobCreationAttributes } from "../model/model";
import { findById, findAllPaged, update, remove, save } from "../db/job"
import { findById as findUserById } from "../db/user"
import { findById as findContractById } from "../db/contract"

export async function find (id: number): Promise<Job>{
    const job = await findById(id);
    if(job == null){
        throw new Error("Invalid Job")
    }

    return job;
}

export async function findAll (page: number, pageSize: number, filters: {}): Promise<PagedResponse<Job>>{
    const jobs: PagedResponse<Job> = await findAllPaged(page, pageSize, filters);
    return jobs;
}

export async function updateJob (id: number, dto: JobUpdates): Promise<Job>{
    const job = await update(id, dto);
    if(job == null){
        throw new Error("Couldn't Update Job")
    }

    return job;
}

export async function deleteJob (id: number) {
    const job = await remove(id);
    if(job == null){
        throw new Error("Couldn't Delete Job")
    }

    return;
}

export async function saveJob (body: JobCreation) {
    //Find users
    const contractor = await findUserById(body.contractId);
    if(contractor==null){
        throw new Error("Invalid Contractor")
    }

    const client = await findUserById(body.clientId);
    if(client==null){
        throw new Error("Invalid Client")
    }

    //Find contract
    const contract =  await findContractById(body.contractId)
    if(contract==null){
        throw new Error("Invalid Contract")
    }

    const data :JobCreationAttributes = {
        description: body.description,
        price: body.price,
        clientId: body.clientId,
        contractorId: body.contractorId,
        ContractId: body.contractId
    }
    const job = await save(data);
    if(job == null){
        throw new Error("Couldn't save Job")
    }

    return;
}
