import { Component, OnInit } from '@angular/core';
import {Directory} from '../../models/directory';
import {DirectoryService} from '../../services/directory/directory.service';

@Component({
  selector: 'app-default-cloudify',
  templateUrl: './default-cloudify.component.html',
  styleUrls: ['./default-cloudify.component.scss']
})
export class DefaultCloudifyComponent implements OnInit {
  directories: Directory[];

  columnDefs = [
    {headerName: 'Nom', field: 'name', resizable: true, width : 500},
    {headerName: 'Propriétaire', field: 'user_create.name', width : 300},
    {headerName: 'Dernière modification', field: 'date_create', width : 300}
  ];

  constructor(private directoryService : DirectoryService) { }

  ngOnInit() {
    this.directoryService.getDirectory().subscribe( async data =>{
      this.directories = data;
    });
  }

  onRowClick(){
    console.log("ok");
  }

}
