import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Directory} from '../../../models/entities/directory';
import {ConstantsService} from "../../constants/constants.service";
import {GetChildren} from "../../../models/responses/getChildren";
import {FileModel} from "../../../models/entities/file";

@Injectable({
    providedIn: 'root'
})
export class DirectoryService {

    constructor(private http: HttpClient,
                private constantsService: ConstantsService) {
    }

    getDirectory(id): Observable<HttpResponse<Directory>> {
        return this.http.get<Directory>(`${this.constantsService.getConstant("URL_DIRECTORY")}/${id}`,
            {observe: "response"});
    }

    create(name: string, parent_directory: string): Observable<HttpResponse<Directory>> {
        return this.http.post<Directory>(this.constantsService.getConstant('URL_DIRECTORY'), {
            name,
            parent_directory
        }, {observe: "response"});
    }

    getChildDirectory(id): Observable<HttpResponse<GetChildren>> {
        const url = this.constantsService.getConstant('URL_GET_CHILD_DIRECTORY').replace(':id', id);
        return this.http.get<GetChildren>(url, {observe: "response"});
    }

    getDeletedFolders(id): Observable<HttpResponse<GetChildren>> {
        const url = this.constantsService.getConstant('URL_GET_DELETED_DIRECTORY').replace(':id', id);
        return this.http.get<GetChildren>(url, {observe: "response"});
    }

    update(fields = {}): Observable<HttpResponse<any>> {
        const url = this.constantsService.getConstant('URL_DIRECTORY');
        return this.http.put<any>(url, fields, {observe: "response"});
    }

    delete(id: string): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.constantsService.getConstant("URL_DIR_DELETE")}/${id}`, {observe: "response"});
    }

    isDeleted(id: string): Observable<HttpResponse<any>> {
        const url = this.constantsService.getConstant('URL_DIRECTORY_IS_DELETED').replace(':id', id);
        return this.http.get<any>(url, {observe: "response"});
    }

    download(id): Observable<HttpResponse<any>> {
        return this.http.get<any>(`${this.constantsService.getConstant("URL_DOWNLOAD_DIR")}/${id}`, {
            responseType: 'blob' as 'json',
            observe: "response"
        });
    }

    undeleteDirectory(id): Observable<HttpResponse<any>> {
        const url = this.constantsService.getConstant('URL_UNDELETE_DIR').replace(':id', id);
        return this.http.delete<any>(url, {observe: "response"});
    }

    hardDeleteDirectory(id): Observable<HttpResponse<any>> {
        const url = this.constantsService.getConstant('URL_HARD_DELETE_DIR').replace(':id', id);
        return this.http.delete<any>(url, {observe: "response"});
    }

}
