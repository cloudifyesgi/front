import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from "../../services/Rest/Authentication/authentication.service";
import {LocalStorageService} from "../../services/localStorage/local-storage.service";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

    constructor(private authenticationService: AuthenticationService,
                private localStorageService: LocalStorageService,
                private router: Router) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const bool = !!this.localStorageService.get('token');

        if (bool) {
            return bool;
        } else {
            this.router.navigate(['/login']);
        }
        return true;
    }

}
