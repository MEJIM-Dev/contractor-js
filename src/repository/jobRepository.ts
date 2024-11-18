import { JobUpdates } from "../dto/types";
import { PagedResponse } from "../dto/types";
import { Job, JobCreationAttributes } from "../model/model"

export async function save (body: JobCreationAttributes): Promise<Job|null> {
    return await Job.create(body);
}

export async function findById (id: number): Promise<Job|null> {
    return await Job.findByPk(id);
}

export async function findAllPaged(page: number, pageSize: number, filters = {}): Promise<PagedResponse<Job>> {
    const offset = (page - 1) * pageSize;
    const { rows, count } = await Job.findAndCountAll({
      where: { ...filters },
      offset,
      limit: pageSize,
    });

    const totalPages = Math.ceil(count / pageSize)

    const response: PagedResponse<Job> = new PagedResponse();
    response.setData(rows);
    response.setPage(page);
    response.setTotal(count);
    response.setTotalPages(totalPages)

    return response;
}

export async function update(id: number, updates: JobUpdates) {
    const job = await Job.findByPk(id);
    if (!job) return null;

    return await job.update(updates);
  }


export async function remove(id: number): Promise<boolean> {
  const job = await Job.findByPk(id);
  if (!job) return false;

    await job.destroy();
    return true;
}