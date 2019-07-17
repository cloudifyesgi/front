import {Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {User} from "../../core/models/entities/user";
import {UserService} from "../../core/services/Rest/User/user.service";
import {DirectoryService} from "../../core/services/Rest/directory/directory.service";
import {Directory} from "../../core/models/entities/directory";
import {ActivatedRoute, Router} from "@angular/router";
import {FileService} from "../../core/services/Rest/file/file.service";
import {FileModel} from "../../core/models/entities/file";
import {FileSystemFileEntry, NgxFileDropEntry} from "ngx-file-drop";
import {DatePipe} from "@angular/common";
import {FormBuilder, Validators} from '@angular/forms';
import {FileCardComponent} from "../../shared/file-card/file-card.component";
import {Link} from "../../core/models/entities/link";
import {ShareLinkService} from "../../core/services/Rest/ShareLink/share-link.service";
import {ToastrService} from "ngx-toastr";
import {Share} from "../../core/models/entities/share";
import {ShareEmailService} from "../../core/services/Rest/ShareEmail/share-email.service";
import {InfoCardComponent} from "../../shared/info-card/info-card.component";
import {NotificationService} from '../../core/services/Notification/notification.service';
import {UploadFolders} from "../../core/models/UploadFolders";
import {FolderCardComponent} from "../../shared/folder-card/folder-card.component";
import {environment} from "../../../environments/environment";

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
    isParent: boolean;
    parentID: string;
    share: Share;
    right_type: string;
    currentShareId: string;
    currentShareParentId: string;
    progressBarValue: { value: number; max: number; number: number } = null;
    @ViewChild(FileCardComponent) fileCardComponent;
    @ViewChild(FolderCardComponent) folderCardComponent;
    @ViewChild(InfoCardComponent) infoCardComponent;
    @ViewChild('downloadZipLink') private downloadZipLink: ElementRef;

    directoryForm = this.fb.group(
        {
            directoryName: ['', [Validators.required, Validators.minLength(1)]]
        }
    );

    linkForm = this.fb.group(
        {
            linkName: ['', [Validators.required, Validators.minLength(1)]],
            linkType: ['', [Validators.required]],
            linkExpiry: ['', [Validators.required]],
            linkActivated: ['', []],
        }
    );

    shareForm = this.fb.group(
        {
            shareEmail: ['', [Validators.required]],
            shareType: ['', [Validators.required]],
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
                private shareEmailService: ShareEmailService,
                private notificationService: NotificationService) {
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
            this.isParent = params.directoryId === '0';
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
                await this.getRightType();
                await this.getRight(this.currentShareParentId);
                this.getSharedFolders(params.directoryId, false, this.currentShareParentId);
                this.getFiles(params.directoryId);
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
        if (this.modeDisplay === 'home') {
            this.getActiveFolders(id);
        } else if (this.modeDisplay === 'trash') {
            this.getDeletedFolders(id);
        } else if (this.modeDisplay === 'sharedFolder') {
            this.getSharedFolders(id, isParent, parentId);
        } else if (this.modeDisplay === 'sharedClouds') {
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
                        if (this.currentDirectory._id === parentId) {
                            return;
                        }
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
        this.shareEmailService.getFolders(user_id).subscribe(response => {
            if (response.status === 200) {
                this.children = response.body;
            }
        });
    }

    getMailSharedFiles(user_id) {
        this.shareEmailService.getFiles(user_id).subscribe(response => {
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

            }
        );
    }

    getDeletedFolders(id: string) {
        this.directoryService.getDeletedFolders('0').subscribe(
            response => {
                if (response.status === 200) {
                    this.children = response.body.children;
                    this.currentDirectory = response.body.breadcrumb.pop();
                    this.parents = response.body.breadcrumb;
                } else {
                    this.router.navigateByUrl('folder/0');
                }

            }
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

            }
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

            }
        );
    }

    dropped(files: NgxFileDropEntry[]) {
        this.filesToUpload = files;
        this.progressBarValue = {max: files.length, value: 0, number: 0};
        let directories: UploadFolders = null;
        for (const droppedFile of files) {
            if (droppedFile.relativePath === droppedFile.fileEntry.name) {
                this.uploadFile(droppedFile, this.currentDirectory._id);
            } else {
                directories = this.treeGenerator(droppedFile, directories);
            }
        }

        if (directories) {
            this.uploadFolder(directories, this.currentDirectory._id);
        }
    }

    uploadFile(droppedFile: NgxFileDropEntry, directoryId: string) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        const filename = droppedFile.relativePath;
        const fileNameArray = filename.split('.');
        const ext = fileNameArray[fileNameArray.length - 1];
        fileEntry.file((file: File) => {

            const formData = new FormData();
            formData.append('file', file);
            formData.append('name', droppedFile.fileEntry.name);
            formData.append('date_create', this.datePipe.transform(Date.now(), 'yyyy-MM-dd'));
            formData.append('file_version', '1');
            formData.append('file_type', ext);
            formData.append('user_create', this.user._id.toString());
            formData.append('user_update', this.user._id.toString());
            formData.append('directory', directoryId);

            this.fileService.uploadFile(formData).subscribe(
                (data) => {
                    this.getFiles(this.currentDirectory._id);
                    this.progressBarValue.value += 100 / this.progressBarValue.max;
                    this.progressBarValue.value = Math.round(this.progressBarValue.value * 100) / 100;
                    this.progressBarValue.number += 1;

                    if (this.progressBarValue.max === this.progressBarValue.number) {
                        this.progressBarValue.value = 100;
                        this.toastr.success(`téléverser avec succès !`, 'Success');
                        setTimeout(() => this.progressBarValue = null, 2000);
                    }
                },
                (err) => {
                    if (err.status === 412) {
                        this.notificationService.showError("Subscription maximum reached", "Fail upload Error");
                    } else {
                        this.toastr.error('Vous ne pouvez pas upload un fichier vide', 'Erreur');
                        console.log(err);
                    }
                }
            );
        });
    }

    uploadFolder(directories: UploadFolders, parentId: string, first = true) {
        this.directoryService.create(directories.name, parentId).subscribe(
            response => {
                if (first) {
                    this.children.push(response.body);
                }
                directories._id = response.body._id;

                directories.files.forEach(
                    file => {
                        this.uploadFile(file, directories._id);
                    }
                );
                directories.directories.forEach(
                    directory => {
                        this.uploadFolder(directory, directories._id, false);
                    }
                );
            }
        );
    }

    treeGenerator(droppedFile: NgxFileDropEntry, directories: UploadFolders): UploadFolders {
        const paths = droppedFile.relativePath.split('/');
        if (!directories) {
            directories = {name: paths[0], directories: [], _id: null, files: []};
        }

        if (paths.length === 2) {
            directories.files.push(droppedFile);
        }
        let currentDir = directories;
        let idx = 1;
        for (; idx < paths.length - 1; idx++) {
            if (directories) {
                let dir = currentDir.directories.find(element => element.name === paths[idx]);
                if (!dir) {
                    currentDir.directories.push({name: paths[idx], directories: [], _id: null, files: []});
                }
                dir = currentDir.directories.find(element => element.name === paths[idx]);
                currentDir = dir;

                if (idx === paths.length - 2) {
                    currentDir.files.push(droppedFile);
                }
            }
        }

        return directories;
    }

    submitFormModal() {
        if (this.directoryForm.valid) {
            if (this.selectedElement) {
                this.editSelectedElement();
            } else {
                this.createDirectory();
            }
        }
    }

    createDirectory() {
        this.directoryService.create(this.directoryForm.value.directoryName, this.currentDirectory._id).subscribe(
            response => {
                this.children.push(response.body);
                jQuery('#getNameDirectory').modal('hide');
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
        if (confirm('Voulez vous vraiment supprimer : ' + this.selectedElement.name + ' ?')) {
            if (this.currentType === 'dir') {
                this.folderCardComponent.deleteFolder(this.selectedElement._id, this.currentDirectory._id, (id) => {
                    this.getFolders(id);
                });
            } else if (this.currentType === 'file') {
                this.fileCardComponent.deleteFile(this.selectedElement._id, this.currentDirectory._id, (id) => {
                    this.getFiles(id);
                });
            }
        }
    }

    async undeleteSelectedElement() {
        if (this.currentType === 'dir') {
            await this.directoryService.undeleteDirectory(this.selectedElement._id).subscribe(
                response => {
                    if (response.status === 200) {
                        console.log('undeleted folder');
                        this.toastr.success('Dossier restauré');
                        this.initHomeMode();
                    }
                }
            );
        } else if (this.currentType === 'file') {
            await this.fileCardComponent.undeleteFile(this.selectedElement._id);
            this.toastr.success('Fichier restauré');
            this.initHomeMode();
        }
    }

    async hardDeleteSelectedElement() {
        if (confirm('Voulez vous vraiment supprimer définitivement : ' + this.selectedElement.name + ' ?')) {
            if (this.currentType === 'dir') {
                // await this.folderCardComponent.hardDeleteFolder(this.selectedElement._id);
                await this.directoryService.hardDeleteDirectory(this.selectedElement._id).subscribe(
                    response => {
                        if (response.status === 200) {
                            console.log('folder archived');
                            this.toastr.success('Dossier archivé');
                            this.initHomeMode();
                        }
                    }
                );
            } else if (this.currentType === 'file') {
                await this.fileCardComponent.hardDeleteFile(this.selectedElement._id).subscribe(
                    response => {
                        if (response.status === 200) {
                            console.log('file archived');
                            this.toastr.success('Fichier archivé');
                            this.initHomeMode();
                        }
                    });
            }
        }
    }

    async downloadCurrentDir() {
        const binaryData = [];
        let url;
        let link;
        const response = await this.directoryService.getDirectory(this.currentDirectory._id).toPromise();
        const dirName = response.body.name + '.zip';

        this.directoryService.download(this.currentDirectory._id).subscribe(res => {
            binaryData.push(res.body);
            url = window.URL.createObjectURL(new Blob(binaryData, {type: res.body.type}));
            link = this.downloadZipLink.nativeElement;
            link.href = url;
            link.download = dirName;
            link.click();
            window.URL.revokeObjectURL(url);
        });
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
        if (this.linkForm.valid) {
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
                    }
                    jQuery('#linkGenerator').modal('hide');
                    this.infoCardComponent.shareCardComponent.getLinkInfo();
                    if (this.currentType === 'dir') {
                        this.toastr.success('Votre lien a bien été généré et copié dans le presse-papier', 'Succès');
                        this.copyText(environment.local_url + '/#/shared/folders/' + data.body._id + '/0');
                    } else if (this.currentType === 'file') {
                        this.toastr.success('Votre lien a bien été généré et copié dans le presse-papier', 'Succès');
                        this.copyText(environment.local_url + '/#/shared/files/' + data.body._id);
                    }
                },
                (err) => {
                    console.log(err);
                }
            );
        }
        this.new_link = {
            link: this.linkForm.value.linkName,
            link_type: this.linkForm.value.linkType,
            expiry_date: this.linkForm.value.linkExpiry,
            is_activated: 'true',
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
                }
                jQuery('#linkGenerator').modal('hide');
                this.infoCardComponent.shareCardComponent.getLinkInfo();
                if (this.currentType === 'dir') {
                    this.toastr.success('Votre lien a bien été généré et copié dans le presse-papier', 'Succès');
                    this.copyText(environment.local_url + '/#/shared/folders/' + data.body._id + '/0');
                } else if (this.currentType === 'file') {
                    this.toastr.success('Votre lien a bien été généré et copié dans le presse-papier', 'Succès');
                    this.copyText(environment.local_url + '/#/shared/files/' + data.body._id);
                }
            },
            (err) => {
                console.log(err);
            }
        );
    }

    copyText(val: string) {
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }

    unsetSelectedElement() {
        this.selectedElement = null;
        this.currentType = null;
    }

    toggleInfoCard() {
        this.isHidden = !this.isHidden;
    }

    async shareElement() {
        if (this.shareForm.valid) {
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
                    console.log(err);
                    this.toastr.error('L\'un des email spécifié n\'existe pas ou le format n\'est pas respecté', 'Erreur');
                    if (err.status !== 401) {
                        console.log(err);
                    }
                });
        }
    }

    showLinkGenerator() {
        return (this.modeDisplay !== 'sharedClouds' && this.modeDisplay !== 'trash') && !this.ReadOnly;
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
            return (this.modeDisplay !== 'sharedClouds' && this.modeDisplay !== 'trash') && !this.ReadOnly;
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
            return (this.currentDirectory !== undefined && this.currentDirectory.name !== 'Home' && this.modeDisplay !== 'trash') && !this.ReadOnly;
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
            return (this.modeDisplay !== 'trash' && !this.ReadOnly);
        }
    }

    showShareForm() {
        return this.modeDisplay !== 'sharedClouds' && this.modeDisplay !== 'trash' && !this.ReadOnly;
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
            return this.modeDisplay !== 'sharedClouds' && this.modeDisplay !== 'trash' && !this.ReadOnly;
        }
    }

    async getRightType() {
        if (this.modeDisplay === 'sharedClouds') {
            const params = this.route.snapshot.params;
            if (params.directoryId === undefined || params.directoryId !== '0') {
                const rep = await this.shareEmailService.getShare(params.shareId).toPromise();
                if (rep.body) {
                    this.right_type = rep.body.right;
                    this.currentShareParentId = rep.body.directory;
                }
            } else {
                this.right_type = 'root';
            }
        }
    }

    async getRight(_id) {
        if (this.currentType === 'file') {
            const res = await this.shareEmailService.getShareForFileAndUser(_id, this.user._id).toPromise();
            this.currentShareId = res.body._id;
        } else {
            const res = await this.shareEmailService.getShareForDirAndUser(_id, this.user._id).toPromise();
            this.currentShareId = res.body._id;
        }
    }

    isInvalid(key: string, form: string): boolean {
        if (form === "directoryForm") {
            return !!this.directoryForm.get(key).errors;
        }
        if (form === "linkForm") {
            return !!this.linkForm.get(key).errors;
        }
        if (form === "shareForm") {
            return !!this.shareForm.get(key).errors;
        }
        return true;

    }
}
