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
        console.log(this.history.action);
        switch (this.history.action) {
            case 'created' :
                this.text = ``;
                this.color = 'success';
                break;
            case 'addedDir' :
                console.log('apapapap');
                if (typeof this.history.child_directory !== "string") {
                    console.log("hey");
                    this.text = `${this.history.child_directory.name}`;
                    this.color = 'info';
                }
                break;
            case 'addedFile':
                if (typeof this.history.child_file !== "string") {
                    if (this.history.child_file.name) {
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
