import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Directory} from '../../../models/entities/directory';
import {ConstantsService} from "../../constants/constants.service";

@Injectable({
    providedIn: 'root'
})
export class DirectoryService {

    constructor(private http: HttpClient,
                private constantsService: ConstantsService) {
    }

    getDirectory(): Observable<Array<Directory>> {
        return <Observable<Array<Directory>>>this.http.get(this.constantsService.getConstant('URL_GET_DIRECTORY'));
    }

    getChildDirectory(id): Observable<Array<Directory>> {
        return <Observable<Array<Directory>>>this.http.get(this.constantsService.getConstant('URL_GET_CHILD_DIRECTORY') + id);
    }

}
