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
import {ToastrService} from "ngx-toastr";

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
                private shareLinkService: ShareLinkService,
                private toastr: ToastrService) {
    }

    async ngOnInit() {
        this.route.params.subscribe(async (params) => {
            await this.getLinkById(params.linkId).then(value => this.link = value.body);
            if (this.link === undefined || this.link === null) {
                this.toastr.error('Ce lien de partage n\'est pas actif', 'Erreur');
                return this.router.navigateByUrl('folders/0');
            }
            if (!this.link.is_activated || Date.parse(this.link.expiry_date) < Date.parse(new Date().toString())) {
                this.toastr.error('Ce lien de partage a expiré', 'Erreur');
                return this.router.navigateByUrl('folders/0');
            }
            this.ReadOnly = this.link.link_type === 'readonly';
            this.getFiles(this.link.file);
        });
    }

    async getLinkById(id) {
        return await this.shareLinkService.getLink(id).toPromise();
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

}
