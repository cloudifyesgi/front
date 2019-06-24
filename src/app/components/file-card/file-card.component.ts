import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FileModel} from "../../core/models/entities/file";
import {FileService} from "../../core/services/Rest/file/file.service";
import {testing} from "rxjs-compat/umd";

@Component({
    selector: 'app-file-card',
    templateUrl: './file-card.component.html',
    styleUrls: ['./file-card.component.scss']
})
export class FileCardComponent implements OnInit {

    @Input() file: FileModel;
    testFile: FileModel;
    @ViewChild('downloadZipLink') private downloadZipLink: ElementRef;

    constructor(private fileService: FileService) {
    }

    ngOnInit() {
    }

    getFile(idFile: string) {
        console.log('lets download this file id:' + idFile);
        /*this.fileService.getFileById(idFile).map(res => {
            return {
                filename: 'filename.pdf',
                data: res.blob()
            };
        }).subscribe( (res) => {
            const url = window.URL.createObjectURL(res.data);
            // this.testFile = data.body;
        });*/
        const binaryData = [];
        let url;
        let link;
        let file_name = 'default_name';
        this.fileService.getFileInfo(idFile).subscribe( (data) => {
            file_name = data.body.name;
        });
        this.fileService.getFileById(idFile).subscribe( res => {
            console.log(res.body);
            binaryData.push(res.body);
            url = window.URL.createObjectURL(new Blob(binaryData, {type: res.body.type}));
            link = this.downloadZipLink.nativeElement;
            link.href = url;
            link.download = file_name;
            link.click();
            window.URL.revokeObjectURL(url);
        });
    }

}
