import { JobCreation, JobUpdates, PagedResponse } from "../dto/types";
import { Job, JobCreationAttributes } from "../model/model";
import { findById, findAllPaged, update, remove, save } from "../db/job"

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

    const data :JobCreationAttributes = {
        description: body.description,
        price: body.price,
        clientId: body.clientId,
        contractorId: body.contractorId
    }
    const job = await save(body);
    if(job == null){
        throw new Error("Couldn't save Job")
    }

    return;
}
