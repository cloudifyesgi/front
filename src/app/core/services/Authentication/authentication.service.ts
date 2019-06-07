import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Login} from "../../models/responses/login";
import {ConstantsService} from "../constantes/constants.service";
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/retry';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    constructor(private http: HttpClient, private constantsService: ConstantsService) {
    }

    login(email: string, password: string) {

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post(this.constantsService.getConstant("URL_POST_LOGIN"), JSON.stringify({
            email: email,
            password: password
        })) as Observable<Login>;
    }

    isAuthenticated() {
        return this.http.get('http://localhost:3000/users');
    }
}
