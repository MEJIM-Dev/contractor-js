import { JobCreation, JobUpdates, PagedResponse } from "../dto/types";
import { Job, JobCreationAttributes, ProfileType } from "../model/model";
import { findById, findAllPaged, update, remove, save } from "../db/job"
import { findById as findUserById } from "../db/user"
import { findById as findContractById } from "../db/contract"
import { validateAmount, validPaymentDate } from "../util/app";

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
    if(body.clientId == body.contractorId){
        throw new Error("Invalid Action")
    }

    //Find users
    const contractor = await findUserById(body.contractorId);
    
    if(contractor==null){
        throw new Error("Invalid Contractor")
    } else if(contractor.type as ProfileType != ProfileType.CONTRACTOR){
        throw new Error("Invalid Contractor")
    }

    const client = await findUserById(body.clientId);
    if(client==null || contractor.type== ProfileType.CLIENT){
        throw new Error("Invalid Client")
    } else if(client.type as ProfileType != ProfileType.CLIENT){
        throw new Error("Invalid Client")
    }

    //Find contract
    const contract =  await findContractById(body.contractId)
    if(contract==null){
        throw new Error("Invalid Contract")
    }

    if(!validPaymentDate(body.paymentDate)){
        throw new Error("Invlaid Date Selected")
    }

    validateAmount(body.price)

    const data :JobCreationAttributes = {
        description: body.description,
        price: body.price,
        clientId: body.clientId,
        contractorId: body.contractorId,
        ContractId: body.contractId,
        paymentDate: new Date(body.paymentDate)
    }

    const job = await save(data);
    if(job == null){
        throw new Error("Couldn't save Job")
    }

    return;
}
