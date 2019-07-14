import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {Directory} from "../../core/models/entities/directory";
import {FileModel} from "../../core/models/entities/file";
import {ShareLinkService} from "../../core/services/Rest/ShareLink/share-link.service";
import {Link} from "../../core/models/entities/link";
import {UserService} from "../../core/services/Rest/User/user.service";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-share-card',
    templateUrl: './share-card.component.html',
    styleUrls: ['./share-card.component.scss']
})
export class ShareCardComponent implements OnInit, OnChanges {
    @Input() element: Directory | FileModel;
    @Input() type: string;
    Links: Array<Link>;

    constructor(private shareLinkService: ShareLinkService, private userService: UserService, private toastr: ToastrService) {
    }

    ngOnInit() {
        this.getLinkInfo();
    }

  ngOnChanges(changes: SimpleChanges) {
      this.getLinkInfo();
  }

  getLinkInfo() {
      if (this.type === 'dir') {
          this.shareLinkService.getLinksForDir(this.element._id).subscribe(
              response => {
                  if (response.status === 200) {
                      this.Links = response.body;
                  }
              },
              err => console.log(err)
          );
      } else {
          this.shareLinkService.getLinksForFile(this.element._id).subscribe(
              response => {
                  if (response.status === 200) {
                      this.Links = response.body;
                  }
              },
              err => console.log(err)
          );
      }
  }


    deleteLink(id) {
        this.shareLinkService.deleteLink(id).subscribe( response => {
            if (response.status === 200) {
                console.log('lien supprimé');
                this.getLinkInfo();
            }},
            err => console.log(err)
        );
    }

    copyText(link_id) {
        let val = "";
        if (this.type === 'dir') {
            val = 'http://localhost:4200/#/shared/folders/' + link_id + '/0'; // @TODO remplacer le lien ici
        } else {
            val = 'http://localhost:4200/#/shared/files/' + link_id; // @TODO remplacer le lien ici
        }
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
        this.toastr.success('Le lien a été copié dans le presse-papier', 'Lien copié');
    }
}
