import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ChartsModule} from 'ng2-charts/ng2-charts';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {LocalStorageService} from "../core/services/localStorage/local-storage.service";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ViewsRouting} from "./views.routing";
import {LoginComponent} from "./authentication/login/login.component";
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {ComponentsModule} from "../components/components.module";
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './authentication/register/register.component';
import {NgxFileDropModule} from "ngx-file-drop";
import { ShareFolderComponent } from './share/share-folder.component';
import { ShareFileComponent } from './share-file/share-file.component';
import { DocifyEditorComponent } from './docify-editor/docify-editor.component';
import {QuillModule} from "ngx-quill";
import {QuillInitializeService} from "../core/services/Quill/quillInitialize.service";
import { SubscriptionComponent } from './subscription/subscription.component';
import { SubscriptionsComponent } from './admin/subscriptions/subscriptions.component';
import { AdminDefaultLayoutComponent } from '../components/admin-default-layout/admin-default-layout.component';
import {DataTablesModule} from 'angular-datatables';
import {CoreModule} from "../core/core.module";

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
        ComponentsModule,
        ReactiveFormsModule,
        NgxFileDropModule,
        QuillModule,
        DataTablesModule,
        CoreModule

    ],
    declarations: [
        DashboardComponent,
        LoginComponent,
        HomeComponent,
        RegisterComponent,
        ShareFolderComponent,
        ShareFileComponent,
        DocifyEditorComponent,
        SubscriptionComponent,
        SubscriptionsComponent
    ],
    providers: [
        LocalStorageService,
        QuillInitializeService
    ]
})
export class ViewsModule {
}
