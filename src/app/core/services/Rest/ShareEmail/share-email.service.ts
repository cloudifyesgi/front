import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {ConstantsService} from "../../constants/constants.service";
import {LocalStorageService} from "../../localStorage/local-storage.service";
import {Observable} from "rxjs";
import {Share} from "../../../models/entities/share";
import {Link} from "../../../models/entities/link";

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
}
