import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ChartsModule} from 'ng2-charts/ng2-charts';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {LocalStorageService} from "../core/services/localStorage/local-storage.service";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ViewsRouting} from "./views.routing";
import {LoginComponent} from "./authentication/login/login.component";

// import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
    imports: [
        FormsModule,
        ViewsRouting,
        ChartsModule,
        BsDropdownModule,
        ButtonsModule.forRoot()
    ],
    declarations: [
        DashboardComponent,
        LoginComponent
    ],
    providers: [LocalStorageService]
})
export class ViewsModule {
}
