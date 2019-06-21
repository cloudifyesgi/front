import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ChartsModule} from 'ng2-charts/ng2-charts';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {LocalStorageService} from "../core/services/localStorage/local-storage.service";
import {DefaultLayoutComponent} from "./default-layout";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AppRoutingModule} from "../app.routing";
import {AppAsideModule, AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule} from "@coreui/angular";
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {TabsModule} from "ngx-bootstrap";
import {AppModule} from "../app.module";
import {RouterModule} from "@angular/router";
import { FileCardComponent } from './file-card/file-card.component';


@NgModule({
    imports: [
        AppAsideModule,
        AppFooterModule,
        AppHeaderModule,
        AppSidebarModule,
        BsDropdownModule.forRoot(),
        TabsModule.forRoot(),
        AppBreadcrumbModule.forRoot(),
        PerfectScrollbarModule,
        FormsModule,
        ChartsModule,
        ButtonsModule.forRoot(),
        RouterModule
    ],
    declarations: [DefaultLayoutComponent, FileCardComponent],
    exports: [
        FileCardComponent
    ],
    providers: [LocalStorageService]
})
export class ComponentsModule {
}
