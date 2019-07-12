import { Component, OnInit } from '@angular/core';
import {UserService} from '../../core/services/Rest/User/user.service';

@Component({
  selector: 'app-navbar-dropdown',
  templateUrl: './navbar-dropdown.component.html',
  styleUrls: ['./navbar-dropdown.component.scss']
})
export class NavbarDropdownComponent implements OnInit {

    constructor(private userService : UserService) { }

    ngOnInit() {
    }
}
