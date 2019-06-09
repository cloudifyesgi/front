import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from "../../services/Rest/Authentication/authentication.service";
import {LocalStorageService} from "../../services/localStorage/local-storage.service";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

    constructor(private authenticationService: AuthenticationService, private localStorageService: LocalStorageService) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        this.authenticationService
            .login("l@l.fr", "test")
            .subscribe((data) => {
                this.localStorageService.set("token", data.body.message);
            }, (err) => {
                console.log(err);
                console.log(err.status);
                console.log(err.error);
            });
        return true;
    }

}
