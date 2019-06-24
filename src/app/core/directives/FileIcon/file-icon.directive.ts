import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
    selector: '[appFileIcon]'
})
export class FileIconDirective implements OnInit {

    @Input('appFileIcon') fileExt: string;

    constructor(private el: ElementRef) {
    }

    ngOnInit(): void {
        console.log(this.fileExt);
        let className = 'fa fa-file';
        const ext = this.fileExt.toLowerCase();
        switch (ext) {
            case 'pdf':
                className = 'fa fa-file-pdf-o';
                break;
            case 'zip':
                className = 'fa fa-file-archive-o';
                break;
            case 'mp3' || 'flac' :
                className = 'fa fa-file-audio-o';
                break;
            case 'js | html | ts | css | c | java':
                className = 'fa fa-file-code-o';
                break;
            case 'xls':
                className = 'fa fa-file-excel-o';
                break;
            case 'png' || 'jpeg':
                className = 'fa fa-file-image-o';
                break;
        }

        const currentClass = this.el.nativeElement.className;
        this.el.nativeElement.className = currentClass + ' ' + className;
    }


}
