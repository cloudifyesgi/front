import {NgxFileDropEntry} from "ngx-file-drop";

export interface UploadFolders {
    name: string;
    _id?: string;
    directories?: Array<UploadFolders>;
    files?: Array<NgxFileDropEntry>;
}
