import { callbackify } from "util";
import { ProfileType } from "../model/model";

export class AuthRequest {
    username!: string;
    password!: string;
}

export class ApiResponse <T> {
    data: T;
    status: string;
    message: string;

    constructor(data: any, status: string, message: string) {
        this.data = data;
        this.status = status;
        this.message = message;
    }

    static success<T>(data: T, message: string): ApiResponse<T> {
        return new ApiResponse(data, "00" , "success");
    }

    static error<T>(message: string, data?: T): ApiResponse<T> {
        return new ApiResponse(data, "99" , "error");
    }
}

export interface LoggedInUser {
    id: number;
    username: string;
}

export class LoggedInUserImpl implements LoggedInUser {
    id!: number;
    username!: string;
}
  
declare global {
    namespace Express {
        interface Request {
            user?: LoggedInUser;
        }
    }
}

export class PagedResponse <T> {
    data: Array<T> = [];
    total: number = 0;
    page: number = 0;
    totalPages: number = 0;

    setData (data: Array<T>): void{
        this.data = data;
    }

    setTotal (total: number): void{
        this.total = total;
    }

    setPage (page: number): void{
        this.page = page;
    }

    setTotalPages(totalPages: number): void{
        this.totalPages = totalPages;
    }
}

export class JobUpdates {
    description: string = "";
    price: number = 0.1;
    paid: false = false;
}

export class JobCreation {
    description!: string;
    price!: number;
    paid!: false;
    contractorId!: number;
    clientId!: number;
}

export interface UserCreation {
    firstName: string;
    lastName: string;
    type: ProfileType;
    password: string;
    balance?: number;
    profession?: string; 
    email: string;
}

export interface UserUpdates {
    firstName?: string;
    lastName?: string;
    password?: string;
    balance?: number;
    profession?: string;
    email?: string;
}

export type AuthObject = Omit<UserCreation, "password"> & {id: number}

export type AccessTokenDto = {
    "access-token": string,
    "refresh-token": string | null
}

export type UserResponseDto = Omit<UserCreation, "password">

export type RoutePermissions = {
    url: string;
    authenticationRequired: boolean;
    method: ExtendedHttpReuestMethods;
}

export enum ExtendedHttpReuestMethods { 
    GET = "GET", 
    POST = "POST",
    PATCH = "PATCH",
    PUT = "PUT",
    DELETE = "DELETE"
}