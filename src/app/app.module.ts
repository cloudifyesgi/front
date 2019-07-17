import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {LocationStrategy, HashLocationStrategy, CommonModule} from '@angular/common';

import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {PERFECT_SCROLLBAR_CONFIG} from 'ngx-perfect-scrollbar';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
const config: SocketIoConfig = { url: 'http://localhost:6789', options: {} };

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

import {AppComponent} from './app.component';

import {
    AppAsideModule,
    AppBreadcrumbModule,
    AppHeaderModule,
    AppFooterModule,
    AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import {AppRoutingModule} from './app.routing';

// Import 3rd party shared
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {ChartsModule} from 'ng2-charts/ng2-charts';
import {CoreModule} from "./core/core.module";
import {TokenInterceptor} from "./core/providers/auth.interceptor";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {NgxFileDropModule} from "ngx-file-drop";
import {ToastrModule} from "ngx-toastr";
import {MomentModule} from "ngx-moment";
import {HttpsInterceptor} from "./core/providers/http.interceptor";
import {RestErrorHandler} from "./core/providers/rest.error-handler";
import {NotificationService} from "./core/services/Notification/notification.service";
import {SocketIoConfig} from "ngx-socket-io/src/config/socket-io.config";
import {SocketIoModule} from "ngx-socket-io";

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        AppAsideModule,
        AppBreadcrumbModule.forRoot(),
        AppFooterModule,
        AppHeaderModule,
        AppSidebarModule,
        PerfectScrollbarModule,
        BsDropdownModule.forRoot(),
        TabsModule.forRoot(),
        ChartsModule,
        CoreModule,
        FormsModule,
        HttpClientModule,
        NgxFileDropModule,
        CommonModule,
        ToastrModule.forRoot({
            preventDuplicates: true
        }),
        SocketIoModule.forRoot(config)
    ],
    exports: [AppRoutingModule],
    declarations: [
        AppComponent
    ],
    providers: [
        RestErrorHandler,
        NotificationService,
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpsInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
