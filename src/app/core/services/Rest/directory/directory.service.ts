import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Directory} from '../../../models/entities/directory';
import {ConstantsService} from "../../constants/constants.service";
import {GetChildren} from "../../../models/responses/getChildren";

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

}
