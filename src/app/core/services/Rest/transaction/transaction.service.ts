import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {ConstantsService} from "../../constants/constants.service";
import {LocalStorageService} from "../../localStorage/local-storage.service";
import {Observable} from "rxjs";
import {Transaction} from '../../../models/entities/transaction';
import {Directory} from '../../../models/entities/directory';
import {Subscription} from '../../../models/entities/subscription';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient,
              private constantsService: ConstantsService,
              private localStorage: LocalStorageService) { }

    getCurrentTransaction(): Observable<HttpResponse<Transaction>> {
        return this.http.get<Transaction>(`${this.constantsService.getConstant("URL_CURRENT_TRANSACTION")}`,
            {observe: "response"});
    }

    create(subscription: Subscription): Observable<HttpResponse<Transaction>> {
        return this.http.post<Transaction>(this.constantsService.getConstant('URL_TRANSACTION'), {
            type : "temp",
            reference : "temp",
            path : "temp",
            name_subscription : subscription.name,
            price_subscription : subscription.price,
            subscription : subscription._id,
        }, {observe: "response"});
    }

}
