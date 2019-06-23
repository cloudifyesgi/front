import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {ConstantsService} from "../../constants/constants.service";
import {Observable} from "rxjs";
import {File} from "../../../models/entities/file";
import {UserService} from "../User/user.service";

@Injectable({
    providedIn: 'root'
})
export class FileService {

    constructor(private http: HttpClient,
                private constantsService: ConstantsService,
                private userService: UserService) {
    }

    getfiles(): Observable<HttpResponse<Array<File>>> {
        return this.http.get<Array<File>>(this.constantsService.getConstant('URL_FILE'), {observe: "response"});
    }

    getFilesByDirectory(id): Observable<HttpResponse<Array<File>>> {
        const url = this.constantsService.getConstant('URL_GET_FILES_BY_DIRECTORY').replace(':id', id);
        return this.http.get<Array<File>>(url, {observe: "response"});
    }
}
