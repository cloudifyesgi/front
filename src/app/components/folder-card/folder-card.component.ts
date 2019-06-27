import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Directory} from "../../core/models/entities/directory";
import {Router} from "@angular/router";

declare var $: any;

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

    selectFolder($event, directory: Directory) {
        $('.selected-card').removeClass('selected-card');
        $(event.currentTarget).addClass('selected-card');
        this.messageEvent.emit(directory);
    }
}
