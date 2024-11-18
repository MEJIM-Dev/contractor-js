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

export interface UserPayload {
    id: number;
    username: string;
  }
  
declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}