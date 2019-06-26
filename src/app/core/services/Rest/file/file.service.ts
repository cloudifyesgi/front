import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {ConstantsService} from "../../constants/constants.service";
import {FileModel} from '../../../models/entities/file';
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

    getFiles(): Observable<Array<File>> {
        return <Observable<Array<File>>>this.http.get(this.constantsService.getConstant('URL_FILE'));
    }

    getFileById(id): Observable<HttpResponse<File>> {
        return this.http.get<File>(`${this.constantsService.getConstant("URL_DOWNLOAD")}/${id}`, {responseType: 'blob' as 'json', observe: "response"});
    }

    getFileInfo(id): Observable<HttpResponse<FileModel>> {
        return this.http.get<FileModel>(`${this.constantsService.getConstant("URL_FILE")}/${id}`, {observe: "response"});
    }

    deleteFile(id): Observable<HttpResponse<FileModel>> {
        return this.http.delete<FileModel>(`${this.constantsService.getConstant("URL_FILE")}/${id}`, {observe: "response"});
    }

    getFileByUser(UserId): Observable<Array<File>> {
        return <Observable<Array<File>>>this.http.get(`${this.constantsService.getConstant("URL_FILE")}/${UserId}`);
    }

    getFilesByDirectory(id): Observable<HttpResponse<Array<FileModel>>> {
        const url = this.constantsService.getConstant('URL_GET_FILES_BY_DIRECTORY').replace(':id', id);
        return this.http.get<Array<FileModel>>(url, {observe: "response"});
    }

    uploadFile(file: FormData): Observable<HttpResponse<File>> {
        return this.http.post<File>(this.constantsService.getConstant('URL_FILE'), file, {observe: "response"});
    }

    getFileByVersions(name): Observable<HttpResponse<Array<FileModel>>> {
        const url = this.constantsService.getConstant('URL_GET_FILES_BY_VERSION').replace(':name', name);
        return this.http.get<Array<FileModel>>(url, {observe: "response"});
    }

    getFileVersion(name, number): Observable<HttpResponse<FileModel>> {
        const url = this.constantsService.getConstant('URL_GET_FILE_BY_VERSION').replace(':name', name).replace(':number', number);
        return this.http.get<FileModel>(url, {observe: "response"});
    }
}
