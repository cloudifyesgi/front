import {File} from "./file";
import {Directory} from "./directory";
import {User} from "./user";

export interface History {
    _id: string;
    action: string;
    file?: File;
    directory?: string | Directory;
    child_directory?: string | Directory;
    child_file?: string | File;
    user: User;
    createdAt?: string;
    updatedAt?: string;
}
