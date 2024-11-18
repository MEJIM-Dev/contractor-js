import { AuthRequest } from "../dto/types";

export async function authenticateUser(dto: AuthRequest) {
    return { id: 1, username: dto.username }
}