import { UserCreation, UserUpdates, PagedResponse } from "../dto/types";
import { Profile, ProfileCreationAttributes } from "../model/model";
import { findById, findAllPaged, update, remove, save } from "../db/user";
import { encryptPassword } from "../util/auth";

export async function find(id: number): Promise<Profile> {
    const user = await findById(id);
    if (user == null) {
        throw new Error("Invalid User");
    }

    return user;
}

export async function findAll(page: number, pageSize: number, filters: {}): Promise<PagedResponse<Profile>> {
    const users: PagedResponse<Profile> = await findAllPaged(page, pageSize, filters);
    return users;
}

export async function updateUser(id: number, dto: UserUpdates): Promise<Profile> {
    const user = await update(id, dto);
    if (user == null) {
        throw new Error("Couldn't Update User");
    }

    return user;
}

export async function deleteUser(id: number): Promise<void> {
    const result = await remove(id);
    if (result == null) {
        throw new Error("Couldn't Delete User");
    }

    return;
}

export async function createUser(body: UserCreation): Promise<Profile> {
    const data: ProfileCreationAttributes = {
        firstName: body.firstName,
        lastName: body.lastName,
        type: body.type,
        password: await encryptPassword(body.password),
        balance: body.balance ?? 0, // Optional, defaults to 0
        profession: body.profession ?? undefined, // Optional
        email: body.email
    };

    const user = await save(data);
    if (user == null) {
        throw new Error("Couldn't save User");
    }

    return user;
}
