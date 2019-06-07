import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {NavbarComponent} from "./components/navbar/navbar.component";
import {ConstantsService} from "./services/constantes/constants.service";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
    declarations: [
        NavbarComponent
    ],
    imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        CommonModule,
        RouterModule,
        HttpClientModule
    ],
    exports: [
        NavbarComponent
    ],
    providers: [
        ConstantsService
    ]
})

export class CoreModule {
}
