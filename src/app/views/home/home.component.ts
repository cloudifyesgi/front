import {Component, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {User} from "../../core/models/entities/user";
import {UserService} from "../../core/services/Rest/User/user.service";
import {DirectoryService} from "../../core/services/Rest/directory/directory.service";
import {Directory} from "../../core/models/entities/directory";
import {ActivatedRoute, Router} from "@angular/router";
import {FileService} from "../../core/services/Rest/file/file.service";
import {FileModel} from "../../core/models/entities/file";
import {History} from "../../core/models/entities/history";
import {FileSystemDirectoryEntry, FileSystemFileEntry, NgxFileDropEntry} from "ngx-file-drop";
import {DatePipe} from "@angular/common";
import {FormBuilder} from "@angular/forms";
import {FileCardComponent} from "../../components/file-card/file-card.component";
import {FolderCardComponent} from "../../components/folder-card/folder-card.component";

declare var jQuery: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [DatePipe]
})
export class HomeComponent implements OnInit, OnChanges {

    user: User;
    children: Array<Directory>;
    parents: Array<Directory>;
    currentDirectory: Directory;
    files: Array<FileModel>;
    filesToUpload: NgxFileDropEntry[] = [];
    isHidden = true;
    fileMenu: FileModel;
    fileHistory: Array<History>;
    selectedElement: Directory | FileModel;
    currentType: string;
    @ViewChild(FileCardComponent) fileCardComponent;
    @ViewChild(FolderCardComponent) folderCardComponent;

    directoryForm = this.fb.group(
        {
            directoryName: ['', []]
        }
    );

    constructor(private userService: UserService,
                private directoryService: DirectoryService,
                private fileService: FileService,
                private route: ActivatedRoute,
                private router: Router,
                private datePipe: DatePipe,
                private fb: FormBuilder) {
    }

    async ngOnInit() {
        this.route.params.subscribe(async (params) => {
            this.user = await this.userService.getUser();
            this.getFolders(params.directoryId);
            this.getFiles(params.directoryId);
            this.unsetSelectedElement();
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.selectedElement = null;
        this.currentType = null;
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
                    console.log(response.body);
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
                const filename = droppedFile.relativePath;
                const fileNameArray = filename.split('.');
                const ext = fileNameArray[fileNameArray.length - 1];
                fileEntry.file((file: File) => {

                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('name', droppedFile.relativePath);
                    formData.append('date_create', this.datePipe.transform(Date.now(), 'yyyy-MM-dd'));
                    formData.append('file_version', '1');
                    formData.append('file_type', ext);
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

    submitFormModal() {
        if (this.selectedElement) {
            this.editSelectedElement();
        } else {
            this.createDirectory();
        }
    }

    createDirectory() {
        this.directoryService.create(this.directoryForm.value.directoryName, this.currentDirectory._id).subscribe(
            response => {
                console.log(response);
                this.children.push(response.body);
                jQuery('#getNameDirectory').modal('hide');
            },
            err => {
                console.log(err);
            }
        );
    }

    editSelectedElement() {
        const callback = (id: string) => {
            this.getFiles(id);
            this.getFolders(id);
            jQuery('#getNameDirectory').modal('hide');
        };

        if (this.currentType === 'dir') {
            this.folderCardComponent.renameFolder(this.directoryForm.value.directoryName, this.selectedElement._id,
                this.currentDirectory._id, callback);
        } else if (this.currentType === 'file') {
            this.fileCardComponent.renameFile(this.directoryForm.value.directoryName, this.selectedElement._id,
                this.currentDirectory._id, callback);
        }
    }

    removeSelectedElement() {
        if (confirm('Voulez vous vraiment supprimer : ' + this.selectedElement.name)) {
            if (this.currentType === 'dir') {
                this.folderCardComponent.deleteFolder(this.selectedElement._id, this.currentDirectory._id, (id) => {
                    this.getFolders(id);
                });
            } else if (this.currentType === 'file') {
                this.fileCardComponent.deleteFile(this.selectedElement._id, this.currentDirectory._id, (id) => {
                    this.getFiles(id);
                });
                console.log('delete file ' + this.selectedElement.name);
            }
        }

    }

    setSelectedElement($event: Directory | FileModel, type: string) {
        this.selectedElement = $event;
        this.currentType = type;
    }

    unsetSelectedElement() {
        this.selectedElement = null;
        this.currentType = null;
    }

    showMenu(id, salut) {

    }

    toggleInfoCard() {
        this.isHidden = !this.isHidden;
    }
}
