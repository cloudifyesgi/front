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

    postShare(share): Observable<HttpResponse<Share>> {
        return this.http.post<Share>(`${this.constantsService.getConstant('URL_SHARE')}`, share, {observe: "response"});
    }

    getFolders(user_id): Observable<HttpResponse<Array<Directory>>> {
        return this.http.get<Array<Directory>>(`${this.constantsService.getConstant('URL_SHARE_DIR')}/${user_id}`, {observe: "response"});
    }

    getFiles(user_id): Observable<HttpResponse<Array<FileModel>>> {
        return this.http.get<Array<FileModel>>(`${this.constantsService.getConstant('URL_SHARE_FILE')}/${user_id}`, {observe: "response"});
    }
}
