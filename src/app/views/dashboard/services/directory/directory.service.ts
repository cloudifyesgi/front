import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConstantesService} from '../constantes/constantes.service';
import {Observable} from 'rxjs';
import {Directory} from '../../models/directory';

@Injectable({
  providedIn: 'root'
})
export class DirectoryService {

  constructor(private http: HttpClient,
              private constantesService: ConstantesService) {
  }

  getDirectory() : Observable<Array<Directory>>{
    return <Observable<Array<Directory>>> this.http.get(this.constantesService.getConstante('URL_GET_DIRECTORY'));
  }

  getChildDirectory(id) : Observable<Array<Directory>>{
    return <Observable<Array<Directory>>> this.http.get(this.constantesService.getConstante('URL_GET_CHILD_DIRECTORY')+id);
  }

}
