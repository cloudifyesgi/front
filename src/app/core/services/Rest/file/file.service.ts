import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ConstantsService} from "../../constants/constants.service";
import {File} from '../../../models/entities/file';
import {Observable} from "rxjs";
import {User} from "../../../models/entities/user";

@Injectable({
  providedIn: 'root'
})
export class FileService {

    private file: File;

    constructor(private http: HttpClient, private constantsService: ConstantsService) { }

    getFiles(): Observable<Array<File>> {
      return <Observable<Array<File>>>this.http.get(this.constantsService.getConstant('URL_FILE'));
    }

    getFileById(id): Observable<File> {
      return this.http.get<File>(`${this.constantsService.getConstant("URL_FILE")}/${id}`);
    }

    async getFile(id): Promise<File> {
        this.file = await this.getFileById(id).toPromise();
        return this.file;
    }

    deleteFile(id): Observable<boolean> {
      return <Observable<boolean>>this.http.delete(`${this.constantsService.getConstant("URL_FILE")}/${id}`);
    }

    getFileByUser(UserId): Observable<Array<File>> {
      return <Observable<Array<File>>>this.http.get(`${this.constantsService.getConstant("URL_FILE")}/${UserId}`);
    }
    }
