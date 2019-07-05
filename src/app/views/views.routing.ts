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
import {ShareFolderComponent} from "./share/share-folder.component";
import {ShareFileComponent} from "./share-file/share-file.component";
import {DirectoryAccessGuard} from "../core/guards/directoryAccess/directory-access.guard";


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
                canActivate: [DirectoryAccessGuard],
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
                path: 'shared/folders/:linkId/:directoryId',
                component: HomeComponent,
                data: {
                    modeDisplay: 'sharedFolder'
                }
            },
            {
                path: 'shared/files/:linkId',
                component: ShareFileComponent
            },
            {
                path: 'sharedClouds/:directoryId',
                component: HomeComponent,
                data: {
                    modeDisplay: 'sharedClouds'
                }
            }
        ]
    }
];

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
