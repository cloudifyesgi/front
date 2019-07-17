import {ErrorHandler, Injectable, Injector} from '@angular/core';
import {Router} from "@angular/router";
import {NotificationService} from "../services/Notification/notification.service";

@Injectable()
export class RestErrorHandler implements ErrorHandler {

    constructor(private route: Router,
                private notificationService: NotificationService) {
    }

    handleError(error: any): void {
        if (error.status === 401) {
            this.notificationService.showError('Not connected', '401');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.route.navigate(['/login']);
        } else if (error.status === 404) {
            this.notificationService.showError('Not found', '404');
            this.route.navigate(['/folders/0']);
        } else if (error.status === 409) {
            console.log('conflict');
        } else if (error.status === 500 || error.status === 0) {
            this.route.navigate(['/servererror']);
        }
    }

    /*handleError(error: any) {
        // const router = this.injector.get(Router);
        // console.log(error);
        /!*if (error.rejection.status === 401 || error.rejection.status === 403) {
            router.navigate(['/login']);
        }*!/
    }*/
}
