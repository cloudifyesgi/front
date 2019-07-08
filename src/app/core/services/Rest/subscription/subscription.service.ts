import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {ConstantsService} from "../../constants/constants.service";
import {LocalStorageService} from "../../localStorage/local-storage.service";
import {Observable} from "rxjs";
import {Subscription} from '../../../models/entities/subscription';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(private http: HttpClient,
              private constantsService: ConstantsService,
              private localStorage: LocalStorageService) { }


    getActiveSubscription(): Observable<HttpResponse<Subscription[]>> {
        return this.http.get<Subscription[]>(`${this.constantsService.getConstant("URL_ACTIVE_SUBSCRIPTION")}`,
            {observe: "response"});
    }
}
