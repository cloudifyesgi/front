import {Component, OnInit} from '@angular/core';
import {QuillInitializeService} from "../../core/services/Quill/quillInitialize.service";
import {DocifyService} from "../../core/services/Rest/Docify/docify.service";
import {ActivatedRoute} from "@angular/router";
import {Docify} from "../../core/models/entities/Docify";
import katex from 'katex';

@Component({
    selector: 'app-docify-editor',
    templateUrl: './docify-editor.component.html',
    styleUrls: ['./docify-editor.component.scss']
})
export class DocifyEditorComponent implements OnInit {
    htmlText = '';
    currentDocify: Docify;
    updated = false;
    edited = false;
    instanceQuill;
    quillConfig = {
        formula: true,
        toolbar: {
            container: [

                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['code-block'],
                [{'header': 1}, {'header': 2}],               // custom button values
                [{'list': 'ordered'}, {'list': 'bullet'}],
                [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
                [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
                [{'direction': 'rtl'}],                         // text direction

                [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
                [{'header': [1, 2, 3, 4, 5, 6, false]}],

                [{'font': []}],
                [{'align': []}],
                ['clean'],                                         // remove formatting button
                ['link'],
                ['formula']
            ],
        },
        autoLink: true,
    };

    constructor(private quillInitializeService: QuillInitializeService,
                private docifyService: DocifyService,
                private route: ActivatedRoute) {
    }

    async ngOnInit() {
        const docifyId = this.route.snapshot.paramMap.get('docifyId');
        await this.docifyService.load(docifyId);
        this.docifyService.currentDocify.subscribe(
            docify => {
                if (!this.edited) {
                    const range = this.instanceQuill.getselection();
                    this.htmlText = docify.content;
                    this.currentDocify = docify;
                    this.instanceQuill.setSelection(range);
                    this.updated = true;
                } else {
                    this.edited = false;
                }
            }
        );
    }

    onSelectionChanged(event) {
        if (event.oldRange == null) {
            // this.onFocus();
        }
        if (event.range == null) {
            // this.onBlur();
        }
    }

    editorCreated(editorInstance) {
        this.instanceQuill = editorInstance;
    }

    onContentChanged(event) {
        if (!this.updated) {
            console.log(event.html);
            this.edited = true;
            this.currentDocify.content = event.html;
            this.docifyService.update(this.currentDocify);
        } else {
            this.updated = false;
        }
    }

    OntoolbarClick() {
        console.log("toolbar");
    }


    /* onFocus() {
         console.log("On Focus");
     }

     onBlur() {
         console.log("Blurred");
     }*/
}
