import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SubscriptionService} from '../../../core/services/Rest/subscription/subscription.service';
import {Subscription} from '../../../core/models/entities/subscription';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import {FormBuilder, Validators} from '@angular/forms';

declare var jQuery: any;

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit, OnDestroy {

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: DataTables.Settings = {};
    subscriptions : Subscription[];
    dtTrigger = new Subject();
    newSubscription : Subscription;
    subscriptionForm = this.fb.group(
        {
            subscriptionName: ['', [Validators.required]],
            subscriptionStorage: ['', [Validators.required,Validators.min(0)]],
            subscriptionFileNumber: ['', [Validators.required,Validators.min(0)]],
            subscriptionFileSize: ['', [Validators.required,Validators.min(0)]],
            subscriptionPrice: ['', [Validators.required,Validators.min(0)]],
            subscriptionDescription: ['', [Validators.required]],
            subscriptionStatus: ['', []],
        }
    );

    selectedSubscription : Subscription;
    updateMode : Boolean = false;

    constructor(private subscriptionService : SubscriptionService,
                private fb: FormBuilder,) { }

    async ngOnInit() {
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 10
        };
        await this.getSubscription();
    }

    async getSubscription() {
        this.subscriptionService.getSubscription().subscribe( (data) =>{
            this.subscriptions = data.body;
            this.dtTrigger.next();
        });
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
    }

    async resetTable() {

        this.dtElement.dtInstance.then(async (dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();

            await this.getSubscription();
        });

    }

    createSubscription() {
        if(this.subscriptionForm.valid) {
            this.newSubscription = this.getSubscriptionFromForm();
            if(this.updateMode){
                this.newSubscription._id = this.selectedSubscription._id;
                this.subscriptionService.putSubscription(this.newSubscription).subscribe( async (data) =>{
                    await this.postPutActions(data,false);
                });
            }else{
                this.subscriptionService.postSubscription(this.newSubscription).subscribe( async (data) =>{
                    await this.postPutActions(data,true);
                });
            }
        }
    }

    async postPutActions(data : any ,isPost : boolean){
        if (data.status === isPost ? 201 : 200) {
            await this.resetTable();
        }
        this.subscriptionForm.reset();
        jQuery('#newSubscriptionModal').modal('hide');
        this.updateMode = false;
    }

    getSubscriptionFromForm() : Subscription{
        return {
            name: this.subscriptionForm.value.subscriptionName,
            storage: this.subscriptionForm.value.subscriptionStorage,
            file_number: this.subscriptionForm.value.subscriptionFileNumber,
            file_size: this.subscriptionForm.value.subscriptionFileSize,
            price: this.subscriptionForm.value.subscriptionPrice,
            description: this.subscriptionForm.value.subscriptionDescription,
            status: this.subscriptionForm.value.subscriptionStatus,
        };
    }

    updateSubscription(subscription: Subscription) {
        this.updateMode = true;

        console.log("in update");

        this.selectedSubscription = subscription;

        this.subscriptionForm.controls["subscriptionName"].setValue(subscription.name);
        this.subscriptionForm.controls["subscriptionStorage"].setValue(subscription.storage);
        this.subscriptionForm.controls["subscriptionFileNumber"].setValue(subscription.file_number);
        this.subscriptionForm.controls["subscriptionFileSize"].setValue(subscription.file_size);
        this.subscriptionForm.controls["subscriptionPrice"].setValue(subscription.price);
        this.subscriptionForm.controls["subscriptionDescription"].setValue(subscription.description);
        this.subscriptionForm.controls["subscriptionStatus"].setValue(subscription.status);

    }


    deleteSubscription(subscription: Subscription) {
        this.subscriptionService.deleteSubscription(subscription).subscribe( async (data) =>{
            await this.resetTable();
        });
    }

    createMode() {
        this.updateMode = false;
        this.subscriptionForm.reset();
    }

    isInvalid(key: string): boolean {
        return !!this.subscriptionForm.get(key).errors;
    }
}
