import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import {DefaultCloudifyComponent} from './components/default-cloudify/default-cloudify.component';
import {HttpClientModule} from '@angular/common/http';
import {DirectoryService} from './services/directory/directory.service';
import {CommonModule} from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  imports: [
    FormsModule,
    DashboardRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    HttpClientModule,
    CommonModule,
    AgGridModule.withComponents([DefaultCloudifyComponent])
  ],
  exports : [],
  declarations: [
    DashboardComponent,
    DefaultCloudifyComponent
  ],
  providers : [
    DirectoryService
  ]
})
export class DashboardModule { }
