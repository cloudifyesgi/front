import {Component, Input, OnInit} from '@angular/core';
import {navItems} from '../../_nav';
import {UserService} from '../../core/services/Rest/User/user.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './default-layout.component.html',
    styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit{
    public navItems = navItems;
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

    test() {
        console.log('drtfghjk,jnhbvc');
    }
}
