import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Login} from "../../../models/responses/login";
import {ConstantsService} from "../../constants/constants.service";
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/retry';
import {RestRequestService} from "../restRequest/rest-request.service";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    constructor(private http: HttpClient, private constantsService: ConstantsService) {
    }

    login(email: string, password: string): Observable<HttpResponse<Login>> {
        return this.http
            .post<Login>(this.constantsService.getConstant("URL_POST_LOGIN"), {
                email: email,
                password: password
            }, {observe: "response"});
    }

    isAuthenticated() {
        // return this.http.get('http://localhost:3000/users');
    }
}
