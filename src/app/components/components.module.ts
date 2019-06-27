import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ChartsModule} from 'ng2-charts/ng2-charts';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {LocalStorageService} from "../core/services/localStorage/local-storage.service";
import {DefaultLayoutComponent} from "./default-layout";
import {AppAsideModule, AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule} from "@coreui/angular";
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {TabsModule} from "ngx-bootstrap";
import {RouterModule} from "@angular/router";
import {FolderCardComponent} from './folder-card/folder-card.component';
import {FileCardComponent} from './file-card/file-card.component';
import {CoreModule} from "../core/core.module";
import { InfoCardComponent } from './info-card/info-card.component';
import {MomentModule} from "ngx-moment";
import { HistoryCardComponent } from './history-card/history-card.component';


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
        RouterModule,
        CoreModule,
        MomentModule
    ],
    declarations: [DefaultLayoutComponent, FolderCardComponent, FileCardComponent, InfoCardComponent, HistoryCardComponent],
    exports: [
        FolderCardComponent,
        FileCardComponent,
        InfoCardComponent
    ],
    providers: [LocalStorageService]
})
export class ComponentsModule {
}
