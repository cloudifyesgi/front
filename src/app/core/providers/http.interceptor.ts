import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import "rxjs-compat/add/operator/do";
import {RestErrorHandler} from "./rest.error-handler";


@Injectable()
export class HttpsInterceptor implements HttpInterceptor {

    constructor(private errorHandler: RestErrorHandler) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).do((event: HttpEvent<any>) => {
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                this.errorHandler.handleError(err);
            }
        });
    }

}
