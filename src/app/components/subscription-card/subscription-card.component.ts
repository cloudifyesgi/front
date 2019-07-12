import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Directory} from '../../core/models/entities/directory';
import {Subscription} from '../../core/models/entities/subscription';
import {TransactionService} from '../../core/services/Rest/transaction/transaction.service';
import { Router, NavigationEnd } from '@angular/router';
import {NotificationService} from '../../core/services/Notification/notification.service';


@Component({
  selector: 'app-subscription-card',
  templateUrl: './subscription-card.component.html',
  styleUrls: ['./subscription-card.component.scss']
})
export class SubscriptionCardComponent implements OnInit {
    @Input() subscription: Subscription;
    @Input() isCurrent: boolean;
    @Output() messageEvent = new EventEmitter<void>();


    constructor(private transactionService : TransactionService,
                private router: Router,
                private notificationService : NotificationService) { }

    ngOnInit() {
    }

    changeSubscription() {
        this.transactionService.create(this.subscription).subscribe((data) =>{
            if( data.status === 201){
                this.messageEvent.emit();
                this.notificationService.showInfo("You changed your subscription to : "+this.subscription.name);
            }
        });
    }
}
