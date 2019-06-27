import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {ConstantsService} from "../../constants/constants.service";
import {Observable} from "rxjs";
import {Directory} from "../../../models/entities/directory";
import {GetChildren} from "../../../models/responses/getChildren";
import {History} from "../../../models/entities/history";

@Injectable({
    providedIn: 'root'
})
export class HistoryService {

    constructor(private http: HttpClient,
                private constantsService: ConstantsService) {
    }

    getHistoryByDir(directory): Observable<HttpResponse<Array<History>>> {
        const url = this.constantsService.getConstant('URL_HISTORY_BY_DIR').replace(':id', directory);
        return this.http.get<Array<History>>(url, {observe: "response"});
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
}
