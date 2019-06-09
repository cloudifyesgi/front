import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {ConstantsService} from "../../constants/constants.service";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RestRequestService<t> {

    constructor(private http: HttpClient, private constantsService: ConstantsService) {
    }

    post(target: string, body: any): Observable<HttpResponse<t>> {
        return this.http.post<t>(target, body, {observe: "response"});
    }
}
