import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

// Import Containers

export const routes: Routes = [
    {
        path: '',
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
