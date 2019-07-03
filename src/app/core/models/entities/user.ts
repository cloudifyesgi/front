import {UserGroup} from "./userGroup";

export interface User {
    _id?: string;
    email?: string;
    password?: string;
    name: string;
    firstname: string;
    phone_number: string;
    address: string;
    postal: string;
    city: string;
    rank: string;
    language: string;
    user_groups: Array<UserGroup>;
    belong_user_groups: Array<UserGroup>;
}
