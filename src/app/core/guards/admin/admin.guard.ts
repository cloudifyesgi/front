import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {LocalStorageService} from '../../services/localStorage/local-storage.service';
import {UserService} from '../../services/Rest/User/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    constructor(private userService: UserService,
                private localStorage: LocalStorageService) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.userService.getUserIsAdmin();
    }
  
}
