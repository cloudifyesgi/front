import { Component, OnInit } from '@angular/core';
import {User} from "../../core/models/entities/user";
import {Directory} from "../../core/models/entities/directory";
import {FileModel} from "../../core/models/entities/file";
import {NgxFileDropEntry} from "ngx-file-drop";
import {History} from "../../core/models/entities/history";
import {UserService} from "../../core/services/Rest/User/user.service";
import {DirectoryService} from "../../core/services/Rest/directory/directory.service";
import {FileService} from "../../core/services/Rest/file/file.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Link} from "../../core/models/entities/link";
import {ShareLinkService} from "../../core/services/Rest/ShareLink/share-link.service";

@Component({
  selector: 'app-share-file',
  templateUrl: './share-file.component.html',
  styleUrls: ['./share-file.component.scss']
})
export class ShareFileComponent implements OnInit {
    user: User;
    children: Array<Directory>;
    parents: Array<Directory>;
    currentDirectory: Directory;
    files: Array<FileModel> = [];
    filesToUpload: NgxFileDropEntry[] = [];
    isHidden = true;
    fileMenu: FileModel;
    fileHistory: Array<History>;
    link: Link;
    ReadOnly = true;


    constructor(private userService: UserService,
                private directoryService: DirectoryService,
                private fileService: FileService,
                private route: ActivatedRoute,
                private router: Router,
                private shareLinkService: ShareLinkService) {
    }

    async ngOnInit() {
        this.route.params.subscribe(async (params) => {
            this.user = await this.userService.getUser();
            await this.getLink(params.fileId).then( value => this.link = value.body);
            if (this.link === null) {
                return this.router.navigateByUrl('folders/0');
            }
            if (!this.link.is_activated || Date.parse(this.link.expiry_date) < Date.parse(new Date().toString())) {
                return this.router.navigateByUrl('folders/0');
            }
            this.user = await this.userService.getUser();
            this.getFiles(params.fileId);
        });
    }

    async getLink(id) {
        return await this.shareLinkService.getLinkForFile(id).toPromise();
    }

    getFiles(id: string) {
        this.fileService.getFile(id).subscribe(
            response => {
                if (response.status === 200) {
                    this.files.push(response.body);
                } else {
                    this.router.navigateByUrl('folders/0');
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

}
