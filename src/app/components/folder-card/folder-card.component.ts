import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Directory} from "../../core/models/entities/directory";
import {Router} from "@angular/router";

@Component({
    selector: 'app-folder-card',
    templateUrl: './folder-card.component.html',
    styleUrls: ['./folder-card.component.scss']
})
export class FolderCardComponent implements OnInit {

    @Input() directory: Directory;
    @Output() messageEvent = new EventEmitter<Directory | File>();

    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    openFolder(idFolder: string) {
        this.router.navigate(['folders/' + idFolder]);
    }

    selectFolder(directory: Directory) {
        console.log(directory);
        this.messageEvent.emit(directory);
    }
}
