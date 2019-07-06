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
import {InfoCardComponent} from "../../components/info-card/info-card.component";

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
    right_type: string;
    currentShareId: string;
    @ViewChild(FileCardComponent) fileCardComponent;
    @ViewChild(FolderCardComponent) folderCardComponent;
    @ViewChild(InfoCardComponent) infoCardComponent;

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
                } else if (this.modeDisplay === 'sharedClouds') {
                    this.initCloudMode();
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

    initCloudMode() {
        this.route.params.subscribe(async (params) => {
            this.user = await this.userService.getUser();
            if (params.shareId === undefined) {
                this.getMailSharedFolders(this.user._id);
                this.getMailSharedFiles(this.user._id);
            } else {
                this.getFolders(params.directoryId);
                this.getFiles(params.directoryId);
                await this.getRightType();
            }
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
        if (this.modeDisplay === 'home' || this.modeDisplay === 'sharedClouds') {
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

    getMailSharedFolders(user_id) {
        this.shareEmailService.getFolders(user_id).subscribe( response => {
            if (response.status === 200) {
                this.children = response.body;
            }
        });
    }

    getMailSharedFiles(user_id) {
        this.shareEmailService.getFiles(user_id).subscribe( response => {
            if (response.status === 200) {
                this.files = response.body;
            }
        });
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
        if (this.modeDisplay === 'home' || this.modeDisplay === 'sharedFolder' || this.modeDisplay === 'sharedClouds') {
            this.getActiveFiles(id);
        } else if (this.modeDisplay === 'trash') {
            this.getDeletedFiles(id);
        }
    }

    getActiveFiles(id: string) {
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

    getDeletedFiles(id: string) {
        this.fileService.getDeletedFiles(id).subscribe(
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
                            this.toastr.error('Vous ne pouvez pas upload un fichier vide', 'Erreur');
                            console.log(err);
                        }
                    );
                });
            } else {
                const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
                console.log(droppedFile.relativePath, fileEntry);
                this.toastr.error('Vous ne pouvez pas upload un dossier vide', 'Erreur');
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

    async setSelectedElement($event: Directory | FileModel, type: string) {
        this.selectedElement = $event;
        this.currentType = type;
        if (this.router.url.indexOf('/sharedClouds/0') > -1) {
            await this.getRight(this.selectedElement._id).then();
        } else {
            await this.getRightType();
        }
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
                this.infoCardComponent.shareCardComponent.getLinkInfo();
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

    async shareElement() {
        if (!this.selectedElement) {
            this.toastr.error('Veuillez choisir un dossier ou un fichier à partager', 'Erreur');
            return;
        }
        const emails = this.shareForm.value.shareEmail.split(', ');

        this.share = {
            right: this.shareForm.value.shareType,
            directory: null,
            file: null,
            user: null,
            email: emails
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
                this.infoCardComponent.getShare();
            },
            (err) => {
                this.toastr.error('L\'un des email spécifié n\'existe pas ou le format n\'est pas respecté', 'Erreur');
                if (err.status !== 401) {
                    console.log(err);
                }
            });
    }

    showLinkGenerator() {
        return this.modeDisplay !== 'sharedClouds';
    }

    showNameRenamer() {
        if (this.modeDisplay === 'sharedClouds') {
            if (this.right_type === 'root') {
                return this.currentType !== 'dir';
            } else {
                if (this.right_type === undefined) {
                    return false;
                } else {
                    return (this.right_type === 'write');
                }
            }
        } else {
            return (this.modeDisplay !== 'sharedClouds') || (this.modeDisplay === 'sharedClouds' && this.currentType !== 'dir');
        }
    }

    showUploadZone() {
        if (this.modeDisplay === 'sharedClouds') {
            if (this.right_type === 'root') {
                return false;
            } else {
                if (this.right_type === undefined) {
                    return false;
                } else {
                    return (this.right_type === 'write');
                }
            }
        } else {
            return (!this.ReadOnly && this.currentDirectory !== undefined);
        }
    }

    showCreateDirButton() {
        if (this.modeDisplay === 'sharedClouds') {
            if (this.right_type === 'root') {
                return false;
            } else {
                if (this.right_type === undefined) {
                    return false;
                } else {
                    return (this.right_type === 'write');
                }
            }
        } else {
            return !this.ReadOnly;
        }
    }

    showShareForm() {
        return this.modeDisplay !== 'sharedClouds' && this.modeDisplay !== 'trash';
    }

    showDeleteButton() {
        if (this.modeDisplay === 'sharedClouds') {
            if (this.right_type === 'root') {
                return this.currentType !== 'dir';
            } else {
                if (this.right_type === undefined) {
                    return false;
                } else {
                    return (this.right_type === 'write');
                }
            }
        } else {
            return this.modeDisplay !== 'sharedClouds' && this.modeDisplay !== 'trash';
        }
    }

    async getRightType() {
        if (this.modeDisplay === 'sharedClouds') {
            await this.route.params.subscribe(async (params) => {
                if (params.directoryId === undefined || params.directoryId !== '0') {
                    const res = await this.shareEmailService.getShare(params.shareId).toPromise();
                    if (res.body) {
                        this.right_type = res.body.right;
                    }
                } else {
                    this.right_type = 'root';
                }
            });
        }
    }

    async getRight(_id) {
        if (this.currentType === 'dir') {
            const res = await this.shareEmailService.getShareForDirAndUser(_id, this.user._id).toPromise();
            this.currentShareId = res.body._id;
        } else {
            const res = await this.shareEmailService.getShareForFileAndUser(_id, this.user._id).toPromise();
            this.currentShareId = res.body._id;
        }
    }
}
