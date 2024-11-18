import { AuthObject, AuthRequest } from "../dto/types";
import { findByUsername } from "../db/user";
import { Profile } from "../model/model";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12

export async function authenticateUser(dto: AuthRequest): Promise<AuthObject> {
    const user: Profile | null = await findByUsername(dto.username);
    if(user==null){
        throw Error("Invalid Username or password")
    }

    const validPassword = validatePassword(dto.password, user.password);
    if(!validPassword){
        throw Error("Invalid Username or password")
    }

    const userResponseData: AuthObject = user;
    return userResponseData;
}


export async function encryptPassword(rawPasword: string): Promise<string> {
    return bcrypt.hashSync(rawPasword, 12)
}

export async function validatePassword(rawPasword: string, encryptPassword: string): Promise<boolean>{
    return await bcrypt.compare(rawPasword, encryptPassword);
}