import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-share-file',
  templateUrl: './share-file.component.html',
  styleUrls: ['./share-file.component.scss']
})
export class ShareFileComponent implements OnInit {
    user: User;
    files: Array<FileModel> = [];
    link: Link;
    ReadOnly = true;
    imageToShow: any;
    isImage = false;
    @ViewChild('downloadZipLink') private downloadZipLink: ElementRef;


    constructor(private userService: UserService,
                private directoryService: DirectoryService,
                private fileService: FileService,
                private route: ActivatedRoute,
                private router: Router,
                private shareLinkService: ShareLinkService,
                private toastr: ToastrService,
                private sanitization: DomSanitizer) {
    }

    ngOnInit() {
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
            await this.getFiles(this.link.file);
            if (this.isImage) {
                const binaryData = [];
                const img_res = await this.fileService.getFileById(this.link.file).toPromise();
                binaryData.push(img_res.body);
                await this.createImageFromBlob(new Blob(binaryData, {type: this.files[0].file_type}));
            }
        });
    }

    async getLinkById(id) {
        return await this.shareLinkService.getLink(id).toPromise();
    }

    async getFiles(id: string) {
        const response = await this.fileService.getFile(id).toPromise();
        if (response.status === 200) {
            if (response.body.deleted === true) {
                this.toastr.error('Le fichier partagé a été supprimé', 'Erreur');
                return this.router.navigateByUrl('folders/0');
            }
            this.files = [];
            this.files.push(response.body);
            this.isImageType(response.body.file_type);
            console.log(this.files);
        } else {
            this.router.navigateByUrl('folders/0');
        }
    }

    async getFile(_id: string) {
        const binaryData = [];
        let url;
        let link;
        const response = await this.fileService.getFileInfo(_id).toPromise();
        const file_name = response.body.name;
        await this.fileService.getFileById(_id).subscribe(res => {
            binaryData.push(res.body);
            url = window.URL.createObjectURL(new Blob(binaryData, {type: res.body.type}));
            link = this.downloadZipLink.nativeElement;
            link.href = url;
            link.download = file_name;
            link.click();
            window.URL.revokeObjectURL(url);
        });
    }


    async createImageFromBlob(image: Blob) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            this.imageToShow = reader.result;
            this.imageToShow = this.sanitization.bypassSecurityTrustUrl(this.imageToShow);
        }, false);

        if (image) {
            reader.readAsDataURL(image);
        }
    }

    isImageType(file_type: string) {
        console.log('isImageType : ', file_type);
        switch (file_type.toLowerCase()) {
            case 'jpg':
                this.isImage = true;
                break;
            case 'png':
                this.isImage = true;
                break;
            default:
                this.isImage = false;
                break;
        }
    }
}
