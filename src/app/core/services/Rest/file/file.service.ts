import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {ConstantsService} from "../../constants/constants.service";
import {FileModel} from '../../../models/entities/file';
import {History} from "../../../models/entities/history";
import {Observable} from "rxjs";
import {User} from "../../../models/entities/user";
import {UserService} from "../User/user.service";
import {Upload} from "../../../models/entities/upload";

@Injectable({
    providedIn: 'root'
})
export class FileService {

    private file: File;

    constructor(private http: HttpClient,
                private constantsService: ConstantsService,
                private userService: UserService) {
    }

    getFile(id): Observable<HttpResponse<FileModel>> {
        return this.http.get<FileModel>(`${this.constantsService.getConstant("URL_FILE")}/${id}`, {observe: "response"});
    }

    getFileById(id): Observable<HttpResponse<File>> {
        return this.http.get<File>(`${this.constantsService.getConstant("URL_DOWNLOAD")}/${id}`, {
            responseType: 'blob' as 'json',
            observe: "response"
        });
    }

    getFileInfo(id): Observable<HttpResponse<FileModel>> {
        return this.http.get<FileModel>(`${this.constantsService.getConstant("URL_FILE")}/${id}`, {observe: "response"});
    }

    deleteFile(id, idParent): Observable<HttpResponse<FileModel>> {
        return this.http.delete<FileModel>(`${this.constantsService.getConstant("URL_FILE_DELETE")}/${id}/${idParent}`, {observe: "response"});
    }

    getFileByUser(UserId): Observable<Array<File>> {
        return <Observable<Array<File>>>this.http.get(`${this.constantsService.getConstant("URL_FILE")}/${UserId}`);
    }

    getFilesByDirectory(id): Observable<HttpResponse<Array<FileModel>>> {
        const url = this.constantsService.getConstant('URL_GET_FILES_BY_DIRECTORY').replace(':id', id);
        return this.http.get<Array<FileModel>>(url, {observe: "response"});
    }
    getDeletedFiles(id): Observable<HttpResponse<Array<FileModel>>> {
        const url = this.constantsService.getConstant('URL_GET_DELETED_FILES').replace(':id', id);
        return this.http.get<Array<FileModel>>(url, {observe: "response"});
    }

    uploadFile(file: FormData): Observable<HttpResponse<File>> {
        return this.http.post<File>(this.constantsService.getConstant('URL_FILE'), file, {observe: "response"});
    }

    getFileByVersions(name, directory): Observable<HttpResponse<Array<FileModel>>> {
        const url = this.constantsService.getConstant('URL_GET_FILES_BY_VERSION').replace(':name', name).replace(':directory', directory);
        return this.http.get<Array<FileModel>>(url, {observe: "response"});
    }

    getFileVersion(name, number, directory): Observable<HttpResponse<FileModel>> {
        const url = this.constantsService.getConstant('URL_GET_FILE_BY_VERSION').replace(':name', name).replace(':number', number).replace(':directory', directory);
        return this.http.get<FileModel>(url, {observe: "response"});
    }

    getFileHistory(file_id): Observable<HttpResponse<Array<History>>> {
        const url = this.constantsService.getConstant('URL_GET_HISTORY_BY_FILE').replace(':id', file_id);
        return this.http.get<Array<History>>(url, {observe: "response"});
    }

    updateFile(fields = {}): Observable<HttpResponse<any>> {
        const url = this.constantsService.getConstant('URL_FILE');
        return this.http.put<any>(url, fields, {observe: "response"});
    }

    undeleteFile(file_id): Observable<HttpResponse<FileModel>> {
        const url = this.constantsService.getConstant('URL_UNDELETE_FILE').replace(':id', file_id);
        return this.http.delete<FileModel>(url, {observe: "response"});
    }

    hardDeleteFile(file_id): Observable<HttpResponse<FileModel>> {
        const url = this.constantsService.getConstant('URL_HARD_DELETE_FILE').replace(':id', file_id);
        return this.http.delete<FileModel>(url, {observe: "response"});
    }
}
