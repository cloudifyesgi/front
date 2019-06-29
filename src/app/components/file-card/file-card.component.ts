import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FileModel} from "../../core/models/entities/file";
import {FileService} from "../../core/services/Rest/file/file.service";
import {testing} from "rxjs-compat/umd";
import {HomeComponent} from "../../views/home/home.component";
import {ShareFolderComponent} from "../../views/share/share-folder.component";
import {UserService} from "../../core/services/Rest/User/user.service";
import {ShareFileComponent} from "../../views/share-file/share-file.component";

@Component({
    selector: 'app-file-card',
    templateUrl: './file-card.component.html',
    styleUrls: ['./file-card.component.scss']
})
export class FileCardComponent implements OnInit {

    @Input() file: FileModel;
    testFile: FileModel;
    @ViewChild('downloadZipLink') private downloadZipLink: ElementRef;

    constructor(private fileService: FileService,
                private homeComponent: HomeComponent,
                private shareFolderComponent: ShareFolderComponent,
                private shareFileCompoonent: ShareFileComponent,
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
        await this.fileService.getFileById(idFile).subscribe( res => {
            binaryData.push(res.body);
            url = window.URL.createObjectURL(new Blob(binaryData, {type: res.body.type}));
            link = this.downloadZipLink.nativeElement;
            link.href = url;
            link.download = file_name;
            link.click();
            window.URL.revokeObjectURL(url);
        });
    }

    deleteFile(id) {
        this.fileService.deleteFile(id).subscribe(
            (data) => {
                if (this.homeComponent) {
                    this.homeComponent.getFiles(this.homeComponent.currentDirectory._id);
                } else if (this.shareFolderComponent) {
                    this.shareFolderComponent.getFiles(this.shareFolderComponent.currentDirectory._id);
                } else if (this.shareFileCompoonent) {
                    this.shareFileCompoonent.getFiles(this.shareFileCompoonent.currentDirectory._id);
                }
            },
            (err) => {
                console.log(err);
            });
    }

    getVersions(name) {
        this.fileService.getFileByVersions(name).subscribe(
            (data) => {
                console.log(data.body);
            },
            (err) => {
                console.log(err);
            });
    }

    getPreviousVersion(name, number) {
        this.fileService.getFileVersion(name, number).subscribe(
            (data) => {
                console.log(data.body);
            },
            (err) => {
                console.log(err);
            });
    }

    showMenu(_id) {
        if (this.homeComponent) {
            this.homeComponent.showMenu(_id, this.userService);
        } else if (this.shareFolderComponent) {
            this.shareFolderComponent.showMenu(_id, this.userService);
        } else if (this.shareFileCompoonent) {
            this.shareFileCompoonent.showMenu(_id, this.userService);
        }
    }
}
