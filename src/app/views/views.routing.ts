import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthenticationGuard} from "../core/guards/authentication/authentication.guard";
import {LocalStorageService} from "../core/services/localStorage/local-storage.service";
import {LoginComponent} from "./authentication/login/login.component";
import {DefaultLayoutComponent} from "../components/default-layout";
import {HomeComponent} from "./home/home.component";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {TokenInterceptor} from "../core/providers/auth.interceptor";
import {RegisterComponent} from "./authentication/register/register.component";
import {ShareFileComponent} from "./share-file/share-file.component";
import {DirectoryAccessGuard} from "../core/guards/directoryAccess/directory-access.guard";
import {DeletedAccessGuard} from "../core/guards/deletedAccess/deleted-access.guard";
import {DocifyEditorComponent} from "./docify-editor/docify-editor.component";
import {SubscriptionComponent} from './subscription/subscription.component';
import {SubscriptionsComponent} from './admin/subscriptions/subscriptions.component';
import {AdminDefaultLayoutComponent} from '../components/admin-default-layout';
import {AdminGuard} from '../core/guards/admin/admin.guard';


const routes: Routes = [
        {
            path: 'login',
            component: LoginComponent
        },
        {
            path: 'register',
            component: RegisterComponent
        },
        {
            path: 'admin',
            component: AdminDefaultLayoutComponent,
            canActivate: [AuthenticationGuard, AdminGuard],
            children: [
                {
                    path: 'subscription',
                    component: SubscriptionsComponent
                }
            ]
        },
        {
            path: 'shared',
            component: DefaultLayoutComponent,
            children: [
                {
                    path: 'files/:linkId',
                    component: ShareFileComponent
                },
            ]
        },
        {
            path: '',
            component: DefaultLayoutComponent,
            canActivate: [AuthenticationGuard],
            children: [

                {
                    path: '',
                    redirectTo: 'folders/0',
                },
                {
                    path: 'folders',
                    redirectTo: 'folders/0',
                },
                {
                    path: 'folders/:directoryId',
                    component: HomeComponent,
                    canActivate: [DirectoryAccessGuard, DeletedAccessGuard],
                    data: {
                        modeDisplay: 'home'
                    }
                },
                {
                    path: 'trash/:directoryId',
                    component: HomeComponent,
                    data: {
                        modeDisplay: 'trash'
                    }
                },
                {
                    path: 'sharedClouds/0',
                    component: HomeComponent,
                    data: {
                        modeDisplay: 'sharedClouds'
                    }
                },
                {
                    path: 'shared/folders/:linkId/:directoryId',
                    component: HomeComponent,
                    data: {
                        modeDisplay: 'sharedFolder'
                    }
                },
                {
                    path: 'sharedClouds/:shareId/:directoryId',
                    component: HomeComponent,
                    data: {
                        modeDisplay: 'sharedClouds'
                    }
                },
                {
                    path: 'docify/:docifyId',
                    component: DocifyEditorComponent
                },
                {
                    path: 'subscription',
                    component: SubscriptionComponent
                }
            ]
        }
    ]
;

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [
        LocalStorageService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        }
    ]
})
export class ViewsRouting {
}
