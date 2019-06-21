import {Component, Input, OnInit} from '@angular/core';
import {Directory} from "../../core/models/entities/directory";

@Component({
    selector: 'app-file-card',
    templateUrl: './file-card.component.html',
    styleUrls: ['./file-card.component.scss']
})
export class FileCardComponent implements OnInit {

    @Input() directory: Directory;
    constructor() {
    }

    ngOnInit() {
    }

}
