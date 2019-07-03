import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../../core/services/Rest/Authentication/authentication.service";
import {LocalStorageService} from "../../../core/services/localStorage/local-storage.service";
import {Router} from "@angular/router";
import {UserService} from "../../../core/services/Rest/User/user.service";

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
                private router: Router,
                private userService: UserService) {
    }

    ngOnInit() {
    }

    public login() {
        this.authenticationService.login(this.usernameField, this.passwordField)
            .subscribe(
                data => {
                    this.authenticationService.setToken(data.body.message);
                    this.userService.setUser(data.body.user);
                    this.router.navigate(['/']);
                },
                err => {
                    console.log(err);
                }
            );
    }

    public goToRegister() {
        this.router.navigateByUrl('register');
    }

}
