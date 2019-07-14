import {User} from "./user";

export interface Share {
    _id?: string;
    right?: string;
    directory?: string;
    file?: string;
    user?: string| User;
    email?: string[];
}
