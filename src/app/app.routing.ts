import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

// Import Containers
import {DefaultLayoutComponent} from './components';

export const routes: Routes = [
    {
        path: '',
        component: DefaultLayoutComponent,
        loadChildren: './views/views.module#ViewsModule',
        data: {
            title: 'Home'
        }
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
