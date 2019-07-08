import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Directory} from "../../core/models/entities/directory";
import {ActivatedRoute, Router} from "@angular/router";
import {FileModel} from "../../core/models/entities/file";
import {DirectoryService} from "../../core/services/Rest/directory/directory.service";

declare var $: any;

@Component({
    selector: 'app-folder-card',
    templateUrl: './folder-card.component.html',
    styleUrls: ['./folder-card.component.scss']
})

export class FolderCardComponent implements OnInit {

    modeDisplay: string;
    linkId: string;
    @Input() directory: Directory;
    @Input() shareId: string;
    @Output() messageEvent = new EventEmitter<Directory | FileModel>();
    @ViewChild('downloadZipLink') private downloadZipLink: ElementRef;

    constructor(private router: Router,
                private  directoryService: DirectoryService,
                private  route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.data.subscribe(
            data => {
                this.modeDisplay = data.modeDisplay;
                if (this.modeDisplay === 'sharedFolder') {
                    this.route.params.subscribe((params) => {
                        this.linkId = params.linkId;
                    });
                } else if (this.modeDisplay === 'sharedClouds') {
                    this.route.params.subscribe( (params) => {
                        this.shareId = params.shareId;
                    });
                }
            });
    }

    async downloadDir(idDir: string) {
        const binaryData = [];
        let url;
        let link;
        const response = await this.directoryService.getDirectory(idDir).toPromise();
        const dirName = response.body.name + '.zip';

        await this.directoryService.download(idDir).subscribe(res => {
            binaryData.push(res.body);
            url = window.URL.createObjectURL(new Blob(binaryData, {type: res.body.type}));
            link = this.downloadZipLink.nativeElement;
            link.href = url;
            link.download = dirName;
            link.click();
            window.URL.revokeObjectURL(url);
        });
    }

    openFolder(idFolder: string) {
        if (this.modeDisplay === 'home' || this.modeDisplay === 'trash') {
            this.router.navigate(['folders/' + idFolder]);
        } else if (this.modeDisplay === 'sharedFolder') {
            this.router.navigate(['shared/folders/' + this.linkId + '/' + idFolder]);
        } else if (this.modeDisplay === 'sharedClouds') {
            this.router.navigate(['sharedClouds/' + this.shareId + '/' + idFolder]);
        }
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
