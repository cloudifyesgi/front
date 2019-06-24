import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
    selector: '[appFileIcon]'
})
export class FileIconDirective implements OnInit {

    @Input('appFileIcon') fileExt: string;

    constructor(private el: ElementRef) {
        const currentClass = this.el.nativeElement.className;
        this.el.nativeElement.className = currentClass + ' fa fa-file';
    }

    ngOnInit(): void {
        console.log(this.fileExt);
    }


}
