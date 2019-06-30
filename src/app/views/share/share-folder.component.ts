import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "../../core/models/entities/user";
import {Directory} from "../../core/models/entities/directory";
import {FileModel} from "../../core/models/entities/file";
import {NgxFileDropEntry} from "ngx-file-drop";
import {History} from "../../core/models/entities/history";
import {UserService} from "../../core/services/Rest/User/user.service";
import {DirectoryService} from "../../core/services/Rest/directory/directory.service";
import {FileService} from "../../core/services/Rest/file/file.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HomeComponent} from "../home/home.component";
import {ShareLinkService} from "../../core/services/Rest/ShareLink/share-link.service";
import {Link} from "../../core/models/entities/link";
import {toDate} from "@angular/common/src/i18n/format_date";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-share',
  templateUrl: './share-folder.component.html',
  styleUrls: ['./share-folder.component.scss']
})
export class ShareFolderComponent implements OnInit {
    user: User;
    children: Array<Directory>;
    parents: Array<Directory> = [];
    currentDirectory: Directory;
    files: Array<FileModel>;
    filesToUpload: NgxFileDropEntry[] = [];
    isHidden = true;
    fileMenu: FileModel;
    fileHistory: Array<History>;
    link: Link;
    ReadOnly: boolean;
    @Input() directory: Directory;
    @Output() messageEvent = new EventEmitter<Directory | File>();
    sharedParentDirectory: Directory;

    constructor(private userService: UserService,
                private directoryService: DirectoryService,
                private fileService: FileService,
                private route: ActivatedRoute,
                private router: Router,
                private homeComponent: HomeComponent,
                private shareLinkService: ShareLinkService,
                private toastr: ToastrService) {
    }

    async ngOnInit() {
        this.route.params.subscribe(async (params) => {
            this.user = await this.userService.getUser();
            if (params.directoryId === '0') {
                console.log('on est dans le dossier parent partagé');
                await this.getLink(params.parentId).then( value => this.link = value.body);
                if (this.link === null) {
                    this.toastr.error('Ce lien de partage n\'est pas actif', 'Erreur');
                    return this.router.navigateByUrl('folders/0');
                }
                if (!this.link.is_activated || Date.parse(this.link.expiry_date) < Date.parse(new Date().toString())) {
                    this.toastr.error('Ce lien de partage a expiré', 'Erreur');
                    return this.router.navigateByUrl('folders/0');
                }
                this.ReadOnly = this.link.link_type === 'readonly';
                this.getFolders(params.parentId, true, 0);
                this.getFiles(params.parentId);
            } else {
                console.log('on est dans un sous dossier partagé');
                await this.getLink(params.parentId).then( value => this.link = value.body);
                if (this.link === null) {
                    this.toastr.error('Ce lien de partage n\'est pas actif', 'Erreur');
                    return this.router.navigateByUrl('folders/0');
                }
                if (!this.link.is_activated || Date.parse(this.link.expiry_date) < Date.parse(new Date().toString())) {
                    this.toastr.error('Ce lien de partage a expiré', 'Erreur');
                    return this.router.navigateByUrl('folders/0');
                }
                this.ReadOnly = this.link.link_type === 'readonly';
                this.getFolders(params.directoryId, false, params.parentId);
                this.getFiles(params.directoryId);
            }
        });
    }

    async getLink(id) {
        return await this.shareLinkService.getLinkForDir(id).toPromise();
    }

    getFolders(id: string, isParent, parentId) {
        this.directoryService.getChildDirectory(id).subscribe(
            response => {
                if (response.status === 200) {
                    if (isParent) {
                        this.children = response.body.children;
                        this.currentDirectory = response.body.breadcrumb.pop();
                        this.sharedParentDirectory = this.currentDirectory;
                    } else {
                        this.parents = [];
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

    openFolder(idFolder: string) {
        this.router.navigate(['shared/folders/' + this.sharedParentDirectory._id + '/' + idFolder]);
    }

    selectFolder($event, directory: Directory) {
        /*$('.selected-card').removeClass('selected-card');
        $(event.currentTarget).addClass('selected-card');*/
        this.messageEvent.emit(directory);
    }

}
