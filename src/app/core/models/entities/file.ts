import {User} from "./user";

export interface FileModel {
    _id: string;
    name?: string;
    date_create?: string;
    file_version?: string;
    file_type?: string;
    user_create?: string | User;
    user_update?: string;
    directory?: string;
    createdAt?: string;
    updatedAt?: string;
    deleted?: boolean;
}
