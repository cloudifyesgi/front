import {Component, Input, OnInit} from '@angular/core';
import {File} from "../../core/models/entities/file";

@Component({
    selector: 'app-file-card',
    templateUrl: './file-card.component.html',
    styleUrls: ['./file-card.component.scss']
})
export class FileCardComponent implements OnInit {

    @Input() file: File;

    constructor() {
    }

    ngOnInit() {
    }

}
