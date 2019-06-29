import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {ConstantsService} from "../../constants/constants.service";
import {LocalStorageService} from "../../localStorage/local-storage.service";
import {Observable} from "rxjs";
import {Link} from "../../../models/entities/link";
import {FileModel} from "../../../models/entities/file";

@Injectable({
  providedIn: 'root'
})
export class ShareLinkService {

    constructor(private http: HttpClient,
              private constantsService: ConstantsService,
              private localStorage: LocalStorageService) {
    }

    getLinkForDir(id): Observable<HttpResponse<Link>> {
        const url = this.constantsService.getConstant('URL_LINK_DIR').replace(':id', id);
        return this.http.get<Link>(url, {observe: "response"});
    }

    getLinkForFile(id): Observable<HttpResponse<Link>> {
        const url = this.constantsService.getConstant('URL_LINK_FILE').replace(':id', id);
        return this.http.get<Link>(url, {observe: "response"});
    }
}
