import {User} from "../entities/user";

export interface Login {
    success: boolean;
    message: string;
    user?: User;
}
