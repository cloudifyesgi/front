import {Component, OnInit} from '@angular/core';
import {User} from "../../core/models/entities/user";
import {UserService} from "../../core/services/Rest/User/user.service";
import {DirectoryService} from "../../core/services/Rest/directory/directory.service";
import {Directory} from "../../core/models/entities/directory";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {FileService} from "../../core/services/Rest/file/file.service";
import {FileModel} from "../../core/models/entities/file";
import {History} from "../../core/models/entities/history";
import {FileSystemDirectoryEntry, FileSystemFileEntry, NgxFileDropEntry} from "ngx-file-drop";
import {Upload} from "../../core/models/entities/upload";
import {DatePipe} from "@angular/common";
import {LocalStorageService} from "../../core/services/localStorage/local-storage.service";
import {copyAnimationEvent} from "@angular/animations/browser/src/render/shared";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [DatePipe]
})
export class HomeComponent implements OnInit {

    user: User;
    children: Array<Directory>;
    parents: Array<Directory>;
    currentDirectory: Directory;
    files: Array<FileModel>;
    filesToUpload: NgxFileDropEntry[] = [];
    isHidden = true;
    fileMenu: FileModel;
    fileHistory: Array<History>;

    constructor(private userService: UserService,
                private directoryService: DirectoryService,
                private fileService: FileService,
                private route: ActivatedRoute,
                private router: Router,
                private datePipe: DatePipe) {
    }

    async ngOnInit() {
        this.route.params.subscribe(async (params) => {
            this.user = await this.userService.getUser();
            this.getFolders(params.directoryId);
            this.getFiles(params.directoryId);
        });
    }

    getFolders(id: string) {
        this.directoryService.getChildDirectory(id).subscribe(
            response => {
                if (response.status === 200) {
                    this.children = response.body.children;
                    this.currentDirectory = response.body.breadcrumb.pop();
                    this.parents = response.body.breadcrumb;
                } else {
                    this.router.navigateByUrl('folder/0');
                }

            },
            err => console.log(err)
        );
    }

    getFiles(id: string) {
        this.fileService.getFilesByDirectory(id).subscribe(
            response => {
                if (response.status === 200) {
                    this.files = response.body;
                } else {
                    this.router.navigateByUrl('folder/0');
                }

            },
            err => console.log(err)
        );
    }

    dropped(files: NgxFileDropEntry[]) {
        this.filesToUpload = files;
        for (const droppedFile of files) {

            // Is it a file?
            if (droppedFile.fileEntry.isFile) {
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
                fileEntry.file((file: File) => {

                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('name', droppedFile.relativePath);
                    formData.append('date_create', this.datePipe.transform(Date.now(), 'yyyy-MM-dd'));
                    formData.append('file_version', '1');
                    formData.append('file_type', 'txt');
                    formData.append('user_create', this.user._id.toString());
                    formData.append('user_update', this.user._id.toString());
                    formData.append('directory', this.currentDirectory._id);

                    this.fileService.uploadFile(formData).subscribe(
                        (data) => {
                            console.log('data.status' + data.status);
                            this.getFiles(this.currentDirectory._id);
                        },
                        (err) => {
                            console.log(err);
                        }
                    );
                });
            } else {
                // It was a directory (empty directories are added, otherwise only files)
                const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
                console.log(droppedFile.relativePath, fileEntry);
            }
        }
    }

    async showMenu(_id, service) {
        await this.fileService.getFileInfo(_id).subscribe( (data) => {
            this.fileMenu = data.body;
            const u_update = service.getUserName(this.fileMenu.user_update).toPromise();
            u_update.then( value => this.fileMenu.user_update = value.name + ' ' + value.firstname);
            const u_create = service.getUserName(this.fileMenu.user_create).toPromise();
            u_create.then( value => this.fileMenu.user_create = value.name + ' ' + value.firstname);
        });
        await this.fileService.getFileHistory(_id).subscribe( (data) => {
            this.fileHistory = data.body;
            this.fileHistory.forEach( function (value) {
                const u = service.getUserName(value.user).toPromise();
                u.then(n => value.user = n.name + ' ' + n.firstname);
            });
        });
        this.isHidden = !this.isHidden;
    }

    getUserName(id): string {
        this.userService.getUserName(id).subscribe( (data) => {
            return data.name + data.firstname;
        });
        return '';
    }
}
