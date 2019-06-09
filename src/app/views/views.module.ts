import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ChartsModule} from 'ng2-charts/ng2-charts';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {LocalStorageService} from "../core/services/localStorage/local-storage.service";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ViewsRouting} from "./views.routing";
import {LoginComponent} from "./authentication/login/login.component";
import {DefaultCloudifyComponent} from "./default-cloudify/default-cloudify.component";
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';

// import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
    imports: [
        FormsModule,
        ViewsRouting,
        ChartsModule,
        BsDropdownModule,
        ButtonsModule.forRoot(),
        HttpClientModule,
        CommonModule,
        AgGridModule.withComponents([DefaultCloudifyComponent])
    ],
    declarations: [
        DashboardComponent,
        LoginComponent,
        DefaultCloudifyComponent
    ],
    providers: [LocalStorageService]
})
export class ViewsModule {
}
