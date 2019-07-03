import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {DirectoryService} from "../../services/Rest/directory/directory.service";
import {UserService} from "../../services/Rest/User/user.service";

@Injectable({
    providedIn: 'root'
})
export class DirectoryAccessGuard implements CanActivate {

    constructor(private directoryService: DirectoryService,
                private userService: UserService) {

    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        const directoryId = next.paramMap.get("directoryId");
        if (directoryId === '0') {
            return true;
        }

        return new Promise((resolve) => {
            this.directoryService.getDirectory(directoryId).subscribe(
                async response => {
                    if (response.status === 200) {
                        const user = await this.userService.getUser();
                        if (user && user._id === response.body.user_create) {
                            resolve(true);
                        }
                    }
                    resolve(false);
                }
            );
        });
    }

}
