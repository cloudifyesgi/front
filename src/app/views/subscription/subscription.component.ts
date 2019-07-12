import { Component, OnInit } from '@angular/core';
import {SubscriptionService} from '../../core/services/Rest/subscription/subscription.service';
import {Subscription} from '../../core/models/entities/subscription';
import {Transaction} from '../../core/models/entities/transaction';
import {TransactionService} from '../../core/services/Rest/transaction/transaction.service';
import {NotificationService} from '../../core/services/Notification/notification.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {
    subscriptions : Subscription[];
    currentTransaction : Transaction;

    constructor(private subscriptionService : SubscriptionService,
                private transactionService : TransactionService) { }

    async ngOnInit() {
        await this.getCurrentTransaction();
        await this.getSubscription();
    }

    async getSubscription() {
        this.subscriptionService.getActiveSubscription().subscribe( (data) =>{
            this.subscriptions = data.body;
        });
    }

    async getCurrentTransaction() {
        this.transactionService.getCurrentTransaction().subscribe( (data) =>{
            this.currentTransaction = data.body;
        });
    }

    async updateCurrentTransaction($event) {
        await this.getCurrentTransaction();
    }
}
