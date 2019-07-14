import {Component} from '@angular/core';
import {UserService} from '../../core/services/Rest/User/user.service';
import {LocalStorageService} from "../../core/services/localStorage/local-storage.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-navbar-dropdown',
    templateUrl: './navbar-dropdown.component.html',
    styleUrls: ['./navbar-dropdown.component.scss']
})
export class NavbarDropdownComponent {

    constructor(private userService: UserService,
                private localStorageService: LocalStorageService,
                private route: Router) {
    }

    logout(): void {
        this.localStorageService.remove('token');
        this.localStorageService.remove('user');
        this.route.navigate(['/login']);
    }
}
