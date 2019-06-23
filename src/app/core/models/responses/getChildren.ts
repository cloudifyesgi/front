import {Directory} from "../entities/directory";

export interface GetChildren {
    children: Array<Directory>;
    breadcrumb: Array<Directory>;
}
