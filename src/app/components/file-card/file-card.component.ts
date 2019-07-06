import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FileModel} from "../../core/models/entities/file";
import {FileService} from "../../core/services/Rest/file/file.service";
import {HomeComponent} from "../../views/home/home.component";
import {UserService} from "../../core/services/Rest/User/user.service";
import {Directory} from "../../core/models/entities/directory";

@Component({
    selector: 'app-file-card',
    templateUrl: './file-card.component.html',
    styleUrls: ['./file-card.component.scss']
})
export class FileCardComponent implements OnInit {

    @Input() file: FileModel;
    @Output() messageEvent = new EventEmitter<Directory | FileModel>();
    @ViewChild('downloadZipLink') private downloadZipLink: ElementRef;

    constructor(private fileService: FileService,
                private homeComponent: HomeComponent,
                private userService: UserService) {
    }

    ngOnInit() {
    }

    async getFile(idFile: string) {
        const binaryData = [];
        let url;
        let link;
        const response = await this.fileService.getFileInfo(idFile).toPromise();
        const file_name = response.body.name;
        await this.fileService.getFileById(idFile).subscribe(res => {
            binaryData.push(res.body);
            url = window.URL.createObjectURL(new Blob(binaryData, {type: res.body.type}));
            link = this.downloadZipLink.nativeElement;
            link.href = url;
            link.download = file_name;
            link.click();
            window.URL.revokeObjectURL(url);
        });
    }

    deleteFile(id, idParent, callback) {
        this.fileService.deleteFile(id, idParent).subscribe(
            (data) => {
                callback(idParent);
            },
            (err) => {
                console.log(err);
            });
    }

    renameFile(newName: string, id: string, idParent: string, callback: (id: string) => void) {
        console.log('rename ' + id + ' to ' + newName);
        this.fileService.updateFile({id: id, name: newName}).subscribe(
            response => {
                if (response.status === 200) {
                    callback(idParent);
                }
            }
        );
        callback(idParent);
    }

    getPreviousVersion(name, number, directory) {
        this.fileService.getFileVersion(name, number, directory).subscribe(
            (data) => {
                console.log(data.body);
            },
            (err) => {
                console.log(err);
            });
    }

    selectFile() {
        this.messageEvent.emit(this.file);
    }
}
