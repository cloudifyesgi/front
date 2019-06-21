import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AuthenticationGuard} from "../core/guards/authentication/authentication.guard";
import {LocalStorageService} from "../core/services/localStorage/local-storage.service";
import {LoginComponent} from "./authentication/login/login.component";
import {DefaultCloudifyComponent} from "./default-cloudify/default-cloudify.component";
import {DefaultLayoutComponent} from "../components/default-layout";
import {HomeComponent} from "./home/home.component";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {TokenInterceptor} from "../core/providers/auth.interceptor";
import {RegisterComponent} from "./authentication/register/register.component";


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
        data: {
            title: 'Dashboard'
        },
        children: [
            {
                path: '',
                component: HomeComponent,
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
