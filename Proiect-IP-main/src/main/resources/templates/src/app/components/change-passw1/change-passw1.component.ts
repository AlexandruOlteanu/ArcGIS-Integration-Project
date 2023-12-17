import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'app-change-passw1',
    templateUrl: './change-passw1.component.html',
    styleUrls: ['./change-passw1.component.css']
})

export class ChangePassw1Component {
    form: FormGroup;

    constructor(public fb: FormBuilder, private http: HttpClient, private router: Router, private snackBar: MatSnackBar) {
        this.form = this.fb.group({
            username: [''],
            email: [''],
        });
    }

    ngOnInit() {
    }

    showSnackbar(content: string, action: string, duration: number) {
        this.snackBar.open(content, action, {
            duration: duration,
            verticalPosition: 'bottom',
            horizontalPosition: 'left',
            panelClass: ['snackbar']
        });
    }

    reset() {
        const formData: any = new FormData();

        const username = this.form.get('username')!.value;
        const email = this.form.get('email')!.value;

        console.log(username + " " + email);

        if (username != "" && email != "") {
            formData.append('username', username);
            formData.append('email', email)
            this.http.post('http://localhost:8082/user/resetPassword', formData)
                .subscribe({
                    next: (response) => {
                        console.log(response);
                        this.showSnackbar('Schimbare de parola realizata cu succes. Noua parola a fost trimisa la adresa: ' + email, 'Ok', 5000);
                    },
                    error: (error) => {
                        console.log(error);
                        this.showSnackbar('Niciun utilizator nu a fost gasit cu numele si adresa de E-Mail introduse.', 'Ok', 5000);
                    },
                });
        }
    }
}




