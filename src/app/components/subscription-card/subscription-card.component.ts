import {Component, Input, OnInit} from '@angular/core';
import {Directory} from '../../core/models/entities/directory';
import {Subscription} from '../../core/models/entities/subscription';
import {TransactionService} from '../../core/services/Rest/transaction/transaction.service';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-subscription-card',
  templateUrl: './subscription-card.component.html',
  styleUrls: ['./subscription-card.component.scss']
})
export class SubscriptionCardComponent implements OnInit {
    @Input() subscription: Subscription;
    @Input() isCurrent: boolean;

    constructor(private transactionService : TransactionService) { }

    ngOnInit() {
    }

    changeSubscription() {
        console.log("called");
        this.transactionService.create(this.subscription).subscribe((data) =>{
            if( data.status === 201){

            }
            console.log(data);
        });

    }
}
