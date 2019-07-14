import { Component, OnInit } from '@angular/core';
import {navItems} from '../../_nav';
import {UserService} from '../../core/services/Rest/User/user.service';
import {adminNavItems} from '../../_admin_nav';

@Component({
  selector: 'app-admin-default-layout',
  templateUrl: './admin-default-layout.component.html',
  styleUrls: ['./admin-default-layout.component.scss']
})
export class AdminDefaultLayoutComponent implements OnInit {

    public navItems = adminNavItems;
    public sidebarMinimized = true;
    private changes: MutationObserver;
    public element: HTMLElement = document.body;
    public user;

    constructor(private userService : UserService) {

        this.changes = new MutationObserver((mutations) => {
            this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
        });

        this.changes.observe(<Element>this.element, {
            attributes: true
        });
    }

    async ngOnInit() {
        this.user =  await this.userService.getUser();
    }

}
