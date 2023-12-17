import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.css']
})

export class LoginPageComponent {
    form: FormGroup;

    constructor(public fb: FormBuilder, private http: HttpClient, private router: Router, private snackBar: MatSnackBar) {
        this.form = this.fb.group({
            username: [''],
            password: [''],
        });
    }

    ngOnInit() {
    }

    showSnackbar(content: string, action: string, duration: number) {
        this.snackBar.open(content, action, {
            duration: duration,
            verticalPosition: 'bottom', // Allowed values are  'top' | 'bottom'
            horizontalPosition: 'left', // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
            panelClass: ['snackbar']
        });
    }

    submit() {
        const formData: any = new FormData();

        const username = this.form.get('username')!.value;
        const password = this.form.get('password')!.value;

        console.log(username + " " + password);

        if (username != "" && password != "") {
            formData.append('username', username);
            formData.append('password', password)
            this.http.post('http://localhost:8082/login', formData)
                .subscribe({
                    next: (response) => {
                        console.log(response);
                        // this.showSnackbar('Schimbare de parola realizata cu succes. Noua parola a fost trimisa la adresa: ' + email, 'Ok', 5000);
                    },
                    error: (error) => {
                        console.log(error);
                        this.showSnackbar('Niciun utilizator nu a fost gasit cu numele si adresa de E-Mail introduse.', 'Ok', 5000);
                    },
                });
        }
    }
}
