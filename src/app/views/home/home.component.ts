import {Component, OnInit} from '@angular/core';
import {User} from "../../core/models/entities/user";
import {UserService} from "../../core/services/Rest/User/user.service";
import {DirectoryService} from "../../core/services/Rest/directory/directory.service";
import {Directory} from "../../core/models/entities/directory";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {FileService} from "../../core/services/Rest/file/file.service";
import {File} from "../../core/models/entities/file";
import {FormBuilder} from "@angular/forms";

declare var jQuery: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    user: User;
    children: Array<Directory>;
    parents: Array<Directory>;
    currentDirectory: Directory;
    selectedElement: Directory | File;
    files: Array<File>;

    directoryForm = this.fb.group(
        {
            directoryName: ['', []]
        }
    );

    constructor(private userService: UserService,
                private directoryService: DirectoryService,
                private fileService: FileService,
                private route: ActivatedRoute,
                private router: Router,
                private fb: FormBuilder) {
    }

    async ngOnInit() {
        this.route.params.subscribe(async (params) => {
            this.user = await this.userService.getUser();
            this.getFolders(params.directoryId);
            this.getFiles(params.directoryId);
        });
    }

    getFolders(id: string) {
        this.directoryService.getChildDirectory(id).subscribe(
            response => {
                if (response.status === 200) {
                    this.children = response.body.children;
                    this.currentDirectory = response.body.breadcrumb.pop();
                    this.parents = response.body.breadcrumb;
                } else {
                    this.router.navigateByUrl('folder/0');
                }

            },
            err => console.log(err)
        );
    }

    getFiles(id: string) {
        this.fileService.getFilesByDirectory(id).subscribe(
            response => {
                if (response.status === 200) {
                    this.files = response.body;
                } else {
                    this.router.navigateByUrl('folder/0');
                }

            },
            err => console.log(err)
        );
    }

    createDirectory() {
        console.log(this.currentDirectory.name);
        console.log(this.directoryForm.value);
        this.directoryService.create(this.directoryForm.value.directoryName, this.currentDirectory._id).subscribe(
            response => {
                console.log(response);
                jQuery('#getNameDirectory').modal('hide');
            },
            err => {
                console.log(err);
            }
        );
    }

    setSelectedElement($event: Directory | File) {
        this.selectedElement = $event;
    }
}
