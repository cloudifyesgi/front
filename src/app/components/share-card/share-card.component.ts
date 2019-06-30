import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Directory} from "../../core/models/entities/directory";
import {FileModel} from "../../core/models/entities/file";
import {ShareLinkService} from "../../core/services/Rest/ShareLink/share-link.service";
import {Link} from "../../core/models/entities/link";
import {UserService} from "../../core/services/Rest/User/user.service";

@Component({
  selector: 'app-share-card',
  templateUrl: './share-card.component.html',
  styleUrls: ['./share-card.component.scss']
})
export class ShareCardComponent implements OnInit, OnChanges {
    @Input() element: Directory | FileModel;
    @Input() type: string;
    Link: Link;

  constructor(private shareLinkService: ShareLinkService, private userService: UserService) { }

  ngOnInit() {
      this.getLinkInfo();
  }

  ngOnChanges() {
      this.getLinkInfo();
  }

  getLinkInfo() {
      if (this.type === 'dir') {
          this.shareLinkService.getLinkForDir(this.element._id).subscribe(
              response => {
                  if (response.status === 200) {
                      this.Link = response.body;
                      this.userService.getUserName(this.Link.user).subscribe( (data) => {
                          this.Link.user = data.name + ' ' + data.firstname;
                      });
                  }
              },
              err => console.log(err)
          );
      } else {
          this.shareLinkService.getLinkForFile(this.element._id).subscribe(
              response => {
                  if (response.status === 200) {
                      this.Link = response.body;
                      this.userService.getUserName(this.Link.user).subscribe( (data) => {
                          this.Link.user = data.name + ' ' + data.firstname;
                      });
                  }
              },
              err => console.log(err)
          );
      }
  }


}
