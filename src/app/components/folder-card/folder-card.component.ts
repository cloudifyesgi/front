import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Directory} from "../../core/models/entities/directory";
import {Router} from "@angular/router";
import {FileModel} from "../../core/models/entities/file";
import {DirectoryService} from "../../core/services/Rest/directory/directory.service";

declare var $: any;

@Component({
    selector: 'app-folder-card',
    templateUrl: './folder-card.component.html',
    styleUrls: ['./folder-card.component.scss']
})

export class FolderCardComponent implements OnInit {

    @Input() directory: Directory;
    @Output() messageEvent = new EventEmitter<Directory | FileModel>();

    constructor(private router: Router,
                private  directoryService: DirectoryService) {
    }

    ngOnInit() {
    }

    openFolder(idFolder: string) {
        this.router.navigate(['folders/' + idFolder]);
    }

    renameFolder(newName: string, id: string, idParent: string, callback: (id: string) => void) {
        this.directoryService.update({id: id, name: newName}).subscribe(
            response => {
                if (response.status === 200) {
                    callback(idParent);
                }
            }
        );
    }

    deleteFolder(id, idParent, callback: (id: string) => void) {
        this.directoryService.delete(id).subscribe(
            response => {
                if (response.status === 200) {
                    callback(idParent);
                }
            }
        );
    }

    selectFolder() {
        this.messageEvent.emit(this.directory);
    }
}
