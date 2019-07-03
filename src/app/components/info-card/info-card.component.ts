import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Directory} from "../../core/models/entities/directory";
import {FileModel} from "../../core/models/entities/file";
import {UserService} from "../../core/services/Rest/User/user.service";
import {HistoryService} from "../../core/services/Rest/history/history.service";
import {History} from "../../core/models/entities/history";
import {FileService} from "../../core/services/Rest/file/file.service";

@Component({
    selector: 'app-info-card',
    templateUrl: './info-card.component.html',
    styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent implements OnInit, OnChanges {

    @Input() element: Directory | FileModel;
    @Input() type: string;
    @Input() versions: Array<FileModel>;
    name: string;
    histories: Array<History>;

    constructor(private userService: UserService,
                private fileService: FileService,
                private historyService: HistoryService) {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.getUserName();
        if (this.type === 'dir') {
            this.getHistories(this.element._id);
        } else if (this.type === 'file') {
            this.getFileHistories(this.element._id);
            this.getVersions(this.element.name);
        }
    }

    getUserName(): void {
        this.userService.getUserById((this.element.user_create as string)).subscribe(
            result => {
                this.name = `${result.firstname} ${result.name}`;
            }
        );
    }

    getHistories(id: string): void {
        this.historyService.getHistoryByDir(id).subscribe(
            result => {
                if (result.status === 200) {
                    this.histories = result.body.reverse();
                }
            }
        );
    }

    getFileHistories(id: string): void {
        this.fileService.getFileHistory(id).subscribe((data) => {
            if (data.status === 200) {
                this.histories = data.body.reverse();
            }
        });
    }

    getVersions(name: string): void {
        this.fileService.getFileByVersions(name).subscribe(
            (data) => {
                this.versions = data.body.reverse();
            },
            (err) => {
                console.log(err);
            });
    }

}
