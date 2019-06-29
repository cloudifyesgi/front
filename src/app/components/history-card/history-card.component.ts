import {Component, Input, OnInit} from '@angular/core';
import {History} from "../../core/models/entities/history";
import {User} from "../../core/models/entities/user";

@Component({
    selector: 'app-history-card',
    templateUrl: './history-card.component.html',
    styleUrls: ['./history-card.component.scss']
})
export class HistoryCardComponent implements OnInit {

    @Input() history: History;
    text: string;
    color: string;

    constructor() {
    }

    ngOnInit() {
        this.getText();
    }

    getText() {
        switch (this.history.action) {
            case 'created' :
                this.text = ``;
                this.color = 'success';
                break;
            case 'addedDir' :
                if (typeof this.history.child_directory !== "string") {
                    this.text = `${this.history.child_directory.name}`;
                    this.color = 'info';
                }
        }
    }

    getTitle(): string {
        return `${(this.history.user as User).firstname} ${(this.history.user as User).name}`;
    }
}
