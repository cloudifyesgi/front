import {Component, OnInit} from '@angular/core';
import {User} from "../../core/models/entities/user";
import {UserService} from "../../core/services/Rest/User/user.service";
import {DirectoryService} from "../../core/services/Rest/directory/directory.service";
import {Directory} from "../../core/models/entities/directory";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    user: User;
    directories: Array<Directory>;
    constructor(private userService: UserService,
                private directoryService: DirectoryService) {
    }

    async ngOnInit() {
        this.user = await this.userService.getUser();
        this.directoryService.getDirectory().subscribe(
            data => {
                this.directories = data;
                console.log(data);
            },
            err => console.log(err)
        );
    }

}
