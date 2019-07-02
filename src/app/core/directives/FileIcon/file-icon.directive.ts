import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
    selector: '[appFileIcon]'
})
export class FileIconDirective implements OnInit {

    @Input('appFileIcon') fileExt: string;

    constructor(private el: ElementRef) {
    }

    ngOnInit(): void {
        let className = 'fa fa-file';
        const ext = this.fileExt.toLowerCase();
        if (ext === 'pdf') {
            className = 'fa fa-file-pdf-o';
        } else if (ext === 'zip') {
            className = 'fa fa-file-archive-o';
        } else if (ext === 'mp3' || ext === 'flac') {
            className = 'fa fa-file-audio-o';
        } else if (ext === 'js' || ext === 'html' || ext === 'ts' || ext === 'css' || ext === 'c' || ext === 'java' || ext === 'py') {
            className = 'fa fa-file-code-o';
        } else if (ext === 'xls' || ext === 'xlsx') {
            className = 'fa fa-file-excel-o';
        } else if (ext === 'png' || ext === 'jpeg') {
            className = 'fa fa-file-image-o';
        }

        const currentClass = this.el.nativeElement.className;
        this.el.nativeElement.className = currentClass + ' ' + className;
    }


}
