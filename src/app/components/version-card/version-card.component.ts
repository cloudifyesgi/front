import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FileModel} from "../../core/models/entities/file";
import {User} from "../../core/models/entities/user";
import {FileService} from "../../core/services/Rest/file/file.service";

@Component({
    selector: 'app-version-card',
    templateUrl: './version-card.component.html',
    styleUrls: ['./version-card.component.scss']
})
export class VersionCardComponent implements OnInit {

    @Input() version: FileModel;
    @Output() reverted = new EventEmitter<string>();
    userCreate: string;

    constructor(private fileService: FileService) {
    }

    ngOnInit() {
        this.userCreate = `${(this.version.user_create as User).firstname} ${(this.version.user_create as User).name}`;
    }



    getPreviousVersion(name, number, directory) {
        if (confirm('Êtes vous sûr de vouloir revenir à la version ' + number + ' de ' + name)) {
            this.fileService.getFileVersion(name, number, directory).subscribe(
                (data) => {
                    console.log(data.body);
                    this.reverted.emit(name);
                },
                (err) => {
                    console.log(err);
                });
        }
    }

}
