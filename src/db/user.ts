import e from "express";
import { PagedResponse } from "../dto/types";
import { Profile, ProfileCreationAttributes } from "../model/model";
import { Transaction, ValidationError } from "sequelize";

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

export async function update(id: number, dto: Partial<ProfileCreationAttributes>, transaction? : Transaction): Promise<Profile | null> {
    const user = await Profile.findByPk(id);
    if (!user) return null;

    return await user.update(dto, {transaction});
}

export async function remove(id: number, transaction? : Transaction): Promise<boolean> {
    const profile = await Profile.findByPk(id);
    if (!profile) return false;

    await profile.destroy({transaction});
    return true;
}

export async function save(data: ProfileCreationAttributes, transaction? : Transaction): Promise<Profile| null> {
    try {
        const user = await Profile.create(data, { transaction });
        console.log(`User saved succesfully`)
        return user; 
    } catch (error) {

        if (error instanceof ValidationError) {
            const errorMessages = error.errors.map((err) => err.message).join(', ');

            // Return a custom error message or send it in the response
            throw new Error(`Validation failed: ${errorMessages}`);
        }
        
        console.error(error)
        return null;
    }
}

export async function findByUsername (email: string): Promise<Profile|null> {
    return await Profile.findOne({ where: { email: email } });
}
