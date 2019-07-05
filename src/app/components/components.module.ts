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
import {HomeComponent} from "../views/home/home.component";
import {DatePipe} from "@angular/common";
import {ShareFolderComponent} from "../views/share/share-folder.component";
import {ShareFileComponent} from "../views/share-file/share-file.component";
import {FolderCardComponent} from './folder-card/folder-card.component';
import {FileCardComponent} from './file-card/file-card.component';
import {CoreModule} from "../core/core.module";
import {InfoCardComponent} from './info-card/info-card.component';
import {HistoryCardComponent} from './history-card/history-card.component';
import {Moment} from "moment";
import {MomentModule} from "ngx-moment";
import {ShareCardComponent} from './share-card/share-card.component';
import {VersionCardComponent} from "./version-card/version-card.component";
import { MailShareCardComponent } from './mail-share-card/mail-share-card.component';


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
    declarations: [
        DefaultLayoutComponent,
        FolderCardComponent,
        FileCardComponent,
        InfoCardComponent,
        HistoryCardComponent,
        ShareCardComponent,
        VersionCardComponent,
        MailShareCardComponent],
    exports: [
        FolderCardComponent,
        FileCardComponent,
        InfoCardComponent,
        VersionCardComponent
    ],
    providers: [LocalStorageService, HomeComponent, DatePipe, ShareFolderComponent, ShareFileComponent]
})
export class ComponentsModule {
}
