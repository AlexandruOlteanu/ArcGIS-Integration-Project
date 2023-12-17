import {Component} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormBuilder, FormGroup} from "@angular/forms";
import {GradeObject} from "../GradeObject";

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.css']
})


export class AdminPageComponent {

    strings: string[] = [];
    grades: GradeObject[] = [];
    form: FormGroup;
    formGrades: FormGroup;

    firstName: string = '';
    lastName: string = '';

    subject_names: { [key: number]: string } = {};

    constructor(public fb: FormBuilder, private http: HttpClient, private snackBar: MatSnackBar) {
        this.form = this.fb.group({
            username: [''],
            role: [''],
            subject: [''],
        });

        this.formGrades = this.fb.group({
            firstName: [''],
            lastName: [''],
        });
    }

    showSnackbar(content: string, action: string, duration: number) {
        this.snackBar.open(content, action, {
            duration: duration,
            verticalPosition: 'bottom',
            horizontalPosition: 'left',
            panelClass: ['snackbar']
        });
    }

    validateNo(e: KeyboardEvent): boolean {
        const charCode = e.which ? e.which : e.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return true
        }
        this.showSnackbar("Acest camp permite doar litere.", "Ok", 4000);
        return false
    }

    getGradesByUser() {
        this.firstName = this.formGrades.get('firstName')!.value;
        this.lastName = this.formGrades.get('lastName')!.value;

        const params1 = new HttpParams()
            .set('firstName', this.firstName)
            .set('lastName', this.lastName);

        this.http.get<GradeObject[]>('http://localhost:8082/Grades/getGradesForAdmin', {params: params1}).subscribe((data: GradeObject[]) => {
            for (const item of data) {
                this.grades.push(item);
            }
        });
    }

    approveGrade(nameMaterie: string) {
        const formData = new FormData();
        formData.append("firstName", this.firstName);
        formData.append("lastName", this.lastName);
        formData.append("materie", nameMaterie);

        this.http.put("http://localhost:8082/Grades/approvedGrades", formData).subscribe({
            next: (response) => {
                console.log(response);
                this.showSnackbar('Notă aprobată.', 'Ok', 5000);
            },
            error: (error) => {
                console.log(error);
                this.showSnackbar('EROARE: Aprobarea nu a fost realizată cu succes.', 'Ok', 5000);
            },
        })
    }

    ngOnInit() {
        this.http.get<string[]>('http://localhost:8082/class/getMaterie').subscribe(data => {
            this.strings = data;
            console.log(this.strings);
        });
    }

    uploadCustomersData(fileInput: any) {
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('file', file, file.name);

        this.http.post('http://localhost:8082/user/upload-customers-data', formData).subscribe({
                next: (response) => {
                    console.log(response);
                    this.showSnackbar('Incarcare fisier .xlsx realizata cu succes!', 'Ok', 5000);
                },
                error: (error) => {
                    console.log(error);
                    this.showSnackbar('EROARE: fisierul .xlsx contine utilizatori deja inregistrati SAU este gol.', 'Ok', 5000);
                },
            }
        );
    }

    enrollSubject() {
        const formData: any = new FormData();

        const username = this.form.get('username')!.value;
        const role = this.form.get('role')!.value;
        const subject = this.form.get('subject')!.value;

        console.log(username + " " + role + " " + subject);

        if (username != "" && subject != "") {
            formData.append('username', username);
            formData.append('subject', subject)

            let url = 'http://localhost:8082/class/';
            if (role == 'student') {
                url = url.concat('addStudent');
            } else {
                url = url.concat('addProfessorToClass');
            }

            console.log(url);

            this.http.post(url, formData)
                .subscribe({
                    next: (response) => {
                        console.log(response);
                        this.showSnackbar('Utilizatorul ' + username + ' a fost inrolat la materia ' + subject, 'Ok', 5000);
                    },
                    error: (error) => {
                        console.log(error);
                        this.showSnackbar("EROARE: Utilizatorul " + username + " este deja inrolat la materia " + subject, 'Ok', 5000);
                    },
                });
        }
    }
}
