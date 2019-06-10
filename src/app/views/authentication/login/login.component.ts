import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../../core/services/Rest/Authentication/authentication.service";
import {LocalStorageService} from "../../../core/services/localStorage/local-storage.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    usernameField: string;
    passwordField: string;

    constructor(private authenticationService: AuthenticationService,
                private localStorageService: LocalStorageService,
                private router: Router) {
    }

    ngOnInit() {
    }

    public login() {
        this.authenticationService.login(this.usernameField, this.passwordField)
            .subscribe(
                data => {
                    this.localStorageService.set("token", data.body.message);
                    this.router.navigate(['/']);
                }
            );
    }

}
