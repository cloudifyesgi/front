import {NgModule} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AuthenticationGuard} from "../core/guards/authentication/authentication.guard";
import {LocalStorageService} from "../core/services/localStorage/local-storage.service";


const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthenticationGuard],
        data: {
            title: 'Dashboard'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [LocalStorageService]
})
export class ViewsRouting {
}
