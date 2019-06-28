import {Component, Input, OnInit} from '@angular/core';
import {Directory} from "../../core/models/entities/directory";
import {Router} from "@angular/router";

@Component({
    selector: 'app-folder-card',
    templateUrl: './folder-card.component.html',
    styleUrls: ['./folder-card.component.scss']
})
export class FolderCardComponent implements OnInit {

    @Input() directory: Directory;

    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    openFolder(idFolder: string) {
        this.router.navigate(['folders/' + idFolder]);
    }

    handleClick() {
    }
}
