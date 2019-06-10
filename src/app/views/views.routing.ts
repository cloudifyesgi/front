import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AuthenticationGuard} from "../core/guards/authentication/authentication.guard";
import {LocalStorageService} from "../core/services/localStorage/local-storage.service";
import {LoginComponent} from "./authentication/login/login.component";
import {DefaultCloudifyComponent} from "./default-cloudify/default-cloudify.component";
import {DefaultLayoutComponent} from "../components/default-layout";


const routes: Routes = [
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
                component: DashboardComponent,
            }
        ]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: "home",
        component: DefaultCloudifyComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [LocalStorageService]
})
export class ViewsRouting {
}
