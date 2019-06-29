import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Directory} from "../../core/models/entities/directory";
import {Router} from "@angular/router";
import {FileModel} from "../../core/models/entities/file";

declare var $: any;

@Component({
    selector: 'app-folder-card',
    templateUrl: './folder-card.component.html',
    styleUrls: ['./folder-card.component.scss']
})

export class FolderCardComponent implements OnInit {

    @Input() directory: Directory;
    @Output() messageEvent = new EventEmitter<Directory | FileModel>();

    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    openFolder(idFolder: string) {
        this.router.navigate(['folders/' + idFolder]);
    }

    selectFolder() {
        this.messageEvent.emit(this.directory);
    }
}
