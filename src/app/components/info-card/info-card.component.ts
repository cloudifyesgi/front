import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Directory} from "../../core/models/entities/directory";
import {File} from "../../core/models/entities/file";
import {UserService} from "../../core/services/Rest/User/user.service";
import {HistoryService} from "../../core/services/Rest/history/history.service";
import {History} from "../../core/models/entities/history";

@Component({
    selector: 'app-info-card',
    templateUrl: './info-card.component.html',
    styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent implements OnInit, OnChanges {

    @Input() element: Directory | File;
    name: string;
    histories: Array<History>;

    constructor(private userService: UserService,
                private historyService: HistoryService) {
    }

    ngOnInit() {
        this.getUserName();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.getUserName();
        this.getHistories(this.element._id);
    }

    getUserName(): void {
        this.userService.getUserById(this.element.user_create).subscribe(
            result => {
                this.name = `${result.firstname} ${result.name}`;
            }
        );
    }

    getHistories(id: string) {
        this.historyService.getHistoryByDir(id).subscribe(
            result => {
                if (result.status) {
                    console.log(result.body);
                    this.histories = result.body;
                }
            }
        );
    }

}
