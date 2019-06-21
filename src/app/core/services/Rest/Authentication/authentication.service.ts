import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Login} from "../../../models/responses/login";
import {ConstantsService} from "../../constants/constants.service";
import {LocalStorageService} from "../../localStorage/local-storage.service";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    private token: string;

    constructor(private http: HttpClient,
                private constantsService: ConstantsService,
                private localStorageService: LocalStorageService) {
    }

    login(email: string, password: string): Observable<HttpResponse<Login>> {
        return this.http
            .post<Login>(this.constantsService.getConstant("URL_POST_LOGIN"), {
                email: email,
                password: password
            }, {observe: "response"});
    }

    setToken(token: string): void {
        this.token = token;
        this.localStorageService.set('token', token);
        this.localStorageService.watch().subscribe(
            data => console.log(data)
        );
    }

    getToken(): string {
        return this.localStorageService.get('token');
        // return this.token;
    }

    isAuthenticated() {
        const token: string = this.localStorageService.get('token');
    }

}
