import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {ConstantsService} from "../../constants/constants.service";
import {LocalStorageService} from "../../localStorage/local-storage.service";
import {Observable} from "rxjs";
import {Share} from "../../../models/entities/share";
import {Directory} from "../../../models/entities/directory";
import {Link} from "../../../models/entities/link";
import {FileModel} from "../../../models/entities/file";

@Injectable({
    providedIn: 'root'
})
export class ShareEmailService {

    constructor(private http: HttpClient,
                private constantsService: ConstantsService,
                private localStorage: LocalStorageService) {
    }

    getShare(shareId): Observable<HttpResponse<Share>> {
        return this.http.get<Share>(`${this.constantsService.getConstant('URL_SHARE')}/${shareId}`, {observe: "response"});
    }

    postShare(share): Observable<HttpResponse<Share>> {
        return this.http.post<Share>(`${this.constantsService.getConstant('URL_SHARE')}`, share, {observe: "response"});
    }

    getFolders(user_id): Observable<HttpResponse<Array<Directory>>> {
        return this.http.get<Array<Directory>>(`${this.constantsService.getConstant('URL_SHARE_DIR')}/${user_id}`, {observe: "response"});
    }

    getFiles(user_id): Observable<HttpResponse<Array<FileModel>>> {
        return this.http.get<Array<FileModel>>(`${this.constantsService.getConstant('URL_SHARE_FILE')}/${user_id}`, {observe: "response"});
    }

    getSharesForDir(dir_id): Observable<HttpResponse<Array<Share>>> {
        return this.http.get<Array<Share>>(`${this.constantsService.getConstant('URL_GET_SHARES_BY_DIR')}/${dir_id}`, {observe: "response"});
    }

    getSharesForFile(file_id): Observable<HttpResponse<Array<Share>>> {
        return this.http.get<Array<Share>>(`${this.constantsService.getConstant('URL_GET_SHARES_BY_FILE')}/${file_id}`, {observe: "response"});
    }

    getShareForDirAndUser(dir_id, user_id): Observable<HttpResponse<Share>> {
        const url = this.constantsService.getConstant('URL_GET_SHARE_BY_DIR_AND_USER').replace(':sharedDir', dir_id).replace(':userId', user_id);
        return this.http.get<Share>(url, {observe: "response"});
    }

    getShareForFileAndUser(file_id, user_id): Observable<HttpResponse<Share>> {
        const url = this.constantsService.getConstant('URL_GET_SHARE_BY_FILE_AND_USER').replace(':sharedFile', file_id).replace(':userId', user_id);
        return this.http.get<Share>(url, {observe: "response"});
    }

    deleteShare(id): Observable<HttpResponse<Share>> {
        return this.http.delete<Share>(`${this.constantsService.getConstant('URL_SHARE')}/${id}`, {observe: "response"});
    }
}
