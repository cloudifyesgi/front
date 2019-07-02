import {Component, Input, OnInit} from '@angular/core';
import {FileModel} from "../../core/models/entities/file";
import {User} from "../../core/models/entities/user";

@Component({
    selector: 'app-version-card',
    templateUrl: './version-card.component.html',
    styleUrls: ['./version-card.component.scss']
})
export class VersionCardComponent implements OnInit {

    @Input() version: FileModel;
    userCreate: string;

    constructor() {
    }

    ngOnInit() {
        this.userCreate = `${(this.version.user_create as User).firstname} ${(this.version.user_create as User).name}`;
    }

}
