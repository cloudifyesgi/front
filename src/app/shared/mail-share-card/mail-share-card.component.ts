import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Directory} from "../../core/models/entities/directory";
import {FileModel} from "../../core/models/entities/file";
import {Share} from "../../core/models/entities/share";
import {ShareEmailService} from "../../core/services/Rest/ShareEmail/share-email.service";
import {User} from "../../core/models/entities/user";
import {UserService} from "../../core/services/Rest/User/user.service";

@Component({
  selector: 'app-mail-share-card',
  templateUrl: './mail-share-card.component.html',
  styleUrls: ['./mail-share-card.component.scss']
})
export class MailShareCardComponent implements OnInit {
    @Input() right: Share;
    @Output() messageEvent = new EventEmitter<void>();
    user: string;

    constructor(private userService: UserService,
                private shareEmailService: ShareEmailService) { }

    ngOnInit() {
      this.getUserName();
    }

    getUserName() {
        this.userService.getUserById((this.right.user as string)).subscribe(
            result => {
                this.user = `${result.firstname} ${result.name}`;
            }
        );
    }

    deleteShare() {
        this.shareEmailService.deleteShare(this.right._id).subscribe( response => {
            if (response.status === 200) {
                this.messageEvent.emit();
            }
        });
    }
}
