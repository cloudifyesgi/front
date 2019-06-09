import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AuthenticationGuard} from "../core/guards/authentication/authentication.guard";
import {LocalStorageService} from "../core/services/localStorage/local-storage.service";
import {LoginComponent} from "./authentication/login/login.component";
import {DefaultCloudifyComponent} from "./default-cloudify/default-cloudify.component";


const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthenticationGuard],
        data: {
            title: 'Dashboard'
        }
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
