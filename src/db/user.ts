import { PagedResponse } from "../dto/types";
import { Profile, ProfileCreationAttributes } from "../model/model";

export async function findById(id: number): Promise<Profile | null> {
    return await Profile.findByPk(id);
}

export async function findAllPaged(page: number, pageSize: number, filters: {}): Promise<PagedResponse<Profile>> {
    const offset = (page - 1) * pageSize;
    const whereClause = { ...filters };

    const { rows, count } = await Profile.findAndCountAll({
        where: whereClause,
        offset,
        limit: pageSize,
    });

    const totalPages = Math.ceil(count / pageSize)

    const response: PagedResponse<Profile> = new PagedResponse();
    response.setData(rows);
    response.setPage(page);
    response.setTotal(count);
    response.setTotalPages(totalPages)

    return response;
}

export async function update(id: number, dto: Partial<ProfileCreationAttributes>): Promise<Profile | null> {
    const user = await Profile.findByPk(id);
    if (!user) return null;

    return await user.update(dto);
}

export async function remove(id: number): Promise<boolean> {
    const profile = await Profile.findByPk(id);
    if (!profile) return false;

    await profile.destroy();
    return true;
}

export async function save(data: ProfileCreationAttributes): Promise<Profile> {
    return await Profile.create(data);

}

export async function findByUsername (email: string): Promise<Profile|null> {
    return await Profile.findOne({ where: { email: email } });
}
