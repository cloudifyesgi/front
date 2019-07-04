import {Component, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {User} from "../../core/models/entities/user";
import {UserService} from "../../core/services/Rest/User/user.service";
import {DirectoryService} from "../../core/services/Rest/directory/directory.service";
import {Directory} from "../../core/models/entities/directory";
import {ActivatedRoute, Router} from "@angular/router";
import {FileService} from "../../core/services/Rest/file/file.service";
import {FileModel} from "../../core/models/entities/file";
import {FileSystemDirectoryEntry, FileSystemFileEntry, NgxFileDropEntry} from "ngx-file-drop";
import {DatePipe} from "@angular/common";
import {FormBuilder} from "@angular/forms";
import {FileCardComponent} from "../../components/file-card/file-card.component";
import {FolderCardComponent} from "../../components/folder-card/folder-card.component";
import {Link} from "../../core/models/entities/link";
import {ShareLinkService} from "../../core/services/Rest/ShareLink/share-link.service";
import {ToastrService} from "ngx-toastr";
import {Share} from "../../core/models/entities/share";
import {ShareEmailService} from "../../core/services/Rest/ShareEmail/share-email.service";

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
    selectedElement: Directory | FileModel;
    currentType: string;
    new_link: Link;
    link: Link;
    ReadOnly = false;
    modeDisplay: string;
    sharedParentDirectory: Directory;
    parentID: string;
    share: Share;
    @ViewChild(FileCardComponent) fileCardComponent;
    @ViewChild(FolderCardComponent) folderCardComponent;

    directoryForm = this.fb.group(
        {
            directoryName: ['', []]
        }
    );

    linkForm = this.fb.group(
        {
            linkName: ['', []],
            linkType: ['', []],
            linkExpiry: ['', []],
            linkActivated: ['', []],
        }
    );

    shareForm = this.fb.group(
        {
            shareEmail: ['', []],
            shareType: ['', []],
        }
    );

    constructor(private userService: UserService,
                private directoryService: DirectoryService,
                private fileService: FileService,
                private route: ActivatedRoute,
                private router: Router,
                private datePipe: DatePipe,
                private fb: FormBuilder,
                private shareLinkService: ShareLinkService,
                private toastr: ToastrService,
                private shareEmailService: ShareEmailService) {
    }

    async ngOnInit() {
        this.route.data.subscribe(
            data => {
                this.modeDisplay = data.modeDisplay;
                if (this.modeDisplay === 'home' || this.modeDisplay === 'trash') {
                    this.initHomeMode();
                } else if (this.modeDisplay === 'sharedFolder') {
                    this.initShareMode();
                }
            }
        );
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.selectedElement = null;
        this.currentType = null;
    }

    initHomeMode() {
        this.route.params.subscribe(async (params) => {
            this.user = await this.userService.getUser();
            this.getFolders(params.directoryId);
            this.getFiles(params.directoryId);
            this.unsetSelectedElement();
        });
    }

    initShareMode() {
        this.route.params.subscribe(async (params) => {
            await this.getLinkById(params.linkId).then(value => this.link = value.body);
            if (this.link === undefined || this.link === null) {
                this.toastr.error('Ce lien de partage n\'est pas actif', 'Erreur');
                return this.router.navigateByUrl('folders/0');
            }
            this.parentID = this.link.directory;
            this.user = await this.userService.getUser();
            if (!this.link.is_activated || Date.parse(this.link.expiry_date) < Date.parse(new Date().toString())) {
                this.toastr.error('Ce lien de partage a expiré', 'Erreur');
                return this.router.navigateByUrl('folders/0');
            }
            this.ReadOnly = this.link.link_type === 'readonly';
            if (params.directoryId === '0') {
                this.getFoldersForParent();
            } else {
                this.getFoldersForChildren(params.directoryId);
            }
        });
    }

    getFoldersForParent() {
        this.getFolders(this.parentID, true, 0);
        this.getFiles(this.parentID);
    }

    getFoldersForChildren(directoryId) {
        this.getFolders(directoryId, false, this.parentID);
        this.getFiles(directoryId);
    }

    getFolders(id: string, isParent = null, parentId = null) {
        if (this.modeDisplay === 'home') {
            this.getActiveFolders(id);
        } else if (this.modeDisplay === 'trash') {
            this.getDeletedFolders(id);
        } else if (this.modeDisplay === 'sharedFolder') {
            this.getSharedFolders(id, isParent, parentId);
        }
    }

    getSharedFolders(id, isParent, parentId) {
        this.directoryService.getChildDirectory(id).subscribe(
            response => {
                if (response.status === 200) {
                    this.parents = [];
                    if (isParent) {
                        this.children = response.body.children;
                        this.currentDirectory = response.body.breadcrumb.pop();
                        this.sharedParentDirectory = this.currentDirectory;
                    } else {
                        this.children = response.body.children;
                        this.currentDirectory = response.body.breadcrumb.pop();
                        let i_dir = response.body.breadcrumb.pop();
                        while (i_dir !== undefined) {
                            if (i_dir._id === parentId) {
                                this.sharedParentDirectory = i_dir;
                                break;
                            }
                            this.parents.push(i_dir);
                            i_dir = response.body.breadcrumb.pop();
                        }
                        this.parents.reverse();
                    }
                } else {
                    this.router.navigateByUrl('folder/0');
                }

            },
            err => console.log(err)
        );
    }

    async getLink(id) {
        return await this.shareLinkService.getLinkForDir(id).toPromise();
    }

    async getLinkById(id) {
        return await this.shareLinkService.getLink(id).toPromise();
    }

    getActiveFolders(id: string) {
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

    getDeletedFolders(id: string) {
        this.directoryService.getDeletedFolders(id).subscribe(
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
        if (this.modeDisplay === 'home' || this.modeDisplay === 'sharedFolder') {
            this.getActiveFiles(id);
        } else if (this.modeDisplay === 'trash') {
            this.getDeletedFiles(id);
        }
    }

    getActiveFiles(id: string) {
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

    getDeletedFiles(id: string) {
        this.fileService.getDeletedFiles(id).subscribe(
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

    async generateLink() {
        if (!this.selectedElement) {
            this.toastr.error('Veuillez choisir un dossier ou un fichier à partager', 'Erreur');
            return;
        }
        this.new_link = {
            link: this.linkForm.value.linkName,
            link_type: this.linkForm.value.linkType,
            expiry_date: this.linkForm.value.linkExpiry,
            is_activated: this.linkForm.value.linkActivated,
            user: this.user._id.toString(),
            directory: null,
            file: null
        };
        if (this.currentType === 'dir') {
            this.new_link.directory = this.selectedElement._id;
        } else {
            this.new_link.file = this.selectedElement._id;
        }
        await this.shareLinkService.postLink(this.new_link).subscribe((data) => {
                if (data.status === 201) {
                    console.log('lien envoyé');
                }
                jQuery('#linkGenerator').modal('hide');
            },
            (err) => {
                console.log(err);
            }
        );
    }

    unsetSelectedElement() {
        this.selectedElement = null;
        this.currentType = null;
    }

    toggleInfoCard() {
        this.isHidden = !this.isHidden;
    }

    async deleteLink() {
        if (this.currentType === 'dir') {
            await this.shareLinkService.getLinkForDir(this.selectedElement._id).toPromise().then(value => this.link = value.body);
        } else if (this.currentType === 'file') {
            await this.shareLinkService.getLinkForFile(this.selectedElement._id).toPromise().then(value => this.link = value.body);
        }
        if (this.link && (this.link.directory === this.selectedElement._id || this.link.file === this.selectedElement._id)) {
            if (confirm('Voulez vous vraiment supprimer le lien de partage sur ' + this.selectedElement.name + ' ?')) {
                this.shareLinkService.deleteLink(this.link._id).subscribe((data) => {
                    console.log(data.status);
                }, (err) => {
                    console.log(err);
                });
                this.getFolders(this.currentDirectory._id);
                this.toastr.info('Le lien de partage a été supprimé', 'Succès');
            }
        } else {
            this.toastr.error('Il n y\'a pas de lien de partage sur ' + this.selectedElement.name, 'Pas de lien');
            console.log('Il n y\'a pas de lien de partage sur ' + this.selectedElement.name);
        }
    }

    async shareElement() {
        if (!this.selectedElement) {
            this.toastr.error('Veuillez choisir un dossier ou un fichier à partager', 'Erreur');
            return;
        }
        this.share = {
            right: this.shareForm.value.shareType,
            directory: null,
            file: null,
            user: null,
            email: this.shareForm.value.shareEmail
        };
        if (this.currentType === 'dir') {
            this.share.directory = this.selectedElement._id;
        } else {
            this.share.file = this.selectedElement._id;
        }
        await this.shareEmailService.postShare(this.share).subscribe((data) => {
                if (data.status === 201) {
                    console.log('element partagé');
                    this.toastr.info('Element partagé', 'Succès');
                } else if (data.status === 303) {
                    console.log('email doesnt exist');
                    this.toastr.error('Cette email n\'existe pas', 'Erreur');
                }
                jQuery('#shareElement').modal('hide');
            },
            (err) => {
                this.toastr.error('Cette email n\'existe pas', 'Erreur');
                console.log(err);
            });
    }
}
