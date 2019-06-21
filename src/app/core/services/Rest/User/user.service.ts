import {Injectable} from '@angular/core';
import {User} from "../../../models/entities/user";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {ConstantsService} from "../../constants/constants.service";
import {LocalStorageService} from "../../localStorage/local-storage.service";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private user: User;

    constructor(private http: HttpClient,
                private constantsService: ConstantsService,
                private localStorage: LocalStorageService) {
    }

    getUserRest(email: string): Observable<User> {
        return this.http.get<User>(`${this.constantsService.getConstant("URL_USER")}/${email}`);
    }

    async getUser(): Promise<User> {
        this.user = await this.getUserRest(this.localStorage.get('user')).toPromise();
        return this.user;
    }

    register(newUser: User): Observable<HttpResponse<User>> {
        return this.http.post<User>(`${this.constantsService.getConstant('URL_REGISTER')}`, newUser, {observe: "response"});
    }

    setUser(user: User): void {
        this.localStorage.set('user', user.email);
        this.user = user;
    }
}