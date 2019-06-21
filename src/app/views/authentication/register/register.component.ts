import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../../core/services/Rest/User/user.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    /* username: string;
     email: string;
     password: string;
     password2: string;*/

    registerFields = this.fb.group({
            firstname: ['', [Validators.required]],
            name: ['', [Validators.required]],
            email: ['', [Validators.email]],
            password: ['', [Validators.minLength(8), Validators.maxLength(25), Validators.required]],
            password2: [''],
        },
        {
            validators: control => {
                const password: string = control.get('password').value;
                const confirmPassword: string = control.get('password2').value;
                if (password !== confirmPassword) {
                    control.get('password2').setErrors({NoPasswordMatch: true});
                }
            }
        });

    constructor(private fb: FormBuilder,
                private userService: UserService,
                private router: Router) {
    }

    ngOnInit() {
    }

    register() {
        if (this.registerFields.valid) {
            this.userService.register(this.registerFields.value).subscribe(
                (data) => {
                    if (data.status === 201) {
                        console.log(data);
                        this.router.navigateByUrl('/login');
                    }
                },
                (err) => {
                    console.log(err);
                }
            );
        }
    }

    isInvalid(key: string): boolean {
        return !!this.registerFields.get(key).errors;
    }

}
