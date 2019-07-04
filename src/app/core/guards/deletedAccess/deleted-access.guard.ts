import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {DirectoryService} from "../../services/Rest/directory/directory.service";
import {promise} from "selenium-webdriver";

@Injectable({
    providedIn: 'root'
})
export class DeletedAccessGuard implements CanActivate {

    constructor(private directoryService: DirectoryService) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const directoryId = next.paramMap.get("directoryId");
        const fileId = next.paramMap.get("fileId");

        if (fileId) {
            return true;
        } else if (directoryId) {
            return this.checkDirectory(directoryId);
        }

        return false;
    }

    checkDirectory(directoryId: string): Promise<boolean> {
        return new Promise(async (resolve) => {
            this.directoryService.isDeleted(directoryId).subscribe(
                response => {
                    if (response.status === 200) {
                        let result;
                        if (response.body.isDeleted === null) {
                            result = false;
                        } else {
                            result = !response.body.isDeleted;
                        }
                        resolve(result);
                    }
                    resolve(false);
                }
            );

        });
    }

}
