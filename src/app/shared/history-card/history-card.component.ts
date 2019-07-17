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
            case 'updated' :
                this.text = ``;
                this.color = ``;
                break;
            case 'reverted' :
                this.text = ``;
                this.color = 'dark';
                break;
            case 'deleted' :
                this.text = ``;
                this.color = 'danger';
                break;
            case 'renamed' :
                this.text = ``;
                this.color = 'warning';
                break;
            case 'restored' :
                this.text = ``;
                this.color = 'info';
                break;
            case 'addedDir' :
                if (typeof this.history.child_directory !== "string") {
                    if (this.history.child_directory !== null) {
                        this.text = `${this.history.child_directory.name}`;
                    }
                }
                break;
            case 'addedFile':
                if (typeof this.history.child_file !== "string") {
                    if (this.history.child_file && this.history.child_file.name) {
                        this.text = `${this.history.child_file.name}`;
                    }
                    this.color = 'primary';
                }
                break;
            case 'deletedFile':
                if (this.history.child_file && typeof this.history.child_file !== "string") {
                    if (this.history.child_file.name) {
                        this.text = `${this.history.child_file.name}`;
                    }
                    this.color = 'warning';
                }
                break;
            case 'deletedDir':
                if (this.history.child_directory && typeof this.history.child_directory !== "string") {
                    if (this.history.child_directory.name) {
                        this.text = `${this.history.child_directory.name}`;
                    }
                    this.color = 'danger';
                }

        }
    }

    getTitle(): string {
        return `${(this.history.user as User).firstname} ${(this.history.user as User).name}`;
    }
}
