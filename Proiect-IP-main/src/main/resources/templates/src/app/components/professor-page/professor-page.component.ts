import {Component} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {StudentObject} from '../StudentObject'
import { ElementRef } from '@angular/core';

@Component({
    selector: 'app-professor-page',
    templateUrl: './professor-page.component.html',
    styleUrls: ['./professor-page.component.css']
})


export class ProfessorPageComponent {
    expanded = false;

    subjects: string[] = [];
    students: string[] = [];
    selectedStudents: string[] = [];

    name: string = '';

    form1: FormGroup;
    form2: FormGroup;

    selectedFlag: boolean = false;

    constructor(public fb: FormBuilder, private http: HttpClient, private snackBar: MatSnackBar) {
        this.form1 = this.fb.group({
            firstName: [''],
            lastName: [''],
            materie: [''],
            grade: 0,
        });

        this.form2 = this.fb.group({
            entry: [''],
            materie: [''],
            grade: 0,
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

    getName() {
        this.http.get<any>('http://localhost:8082/user/getUserProf').subscribe(
            response => {
                this.name = response.lastName + " " + response.firstName;
            },
            error => {
                console.error('Error fetching data:', error);
            }
        );
    }

    ngOnInit() {
        this.http.get<string[]>('http://localhost:8082/class/getMaterie').subscribe(data => {
            this.subjects = data;
        });

        this.http.get<StudentObject[]>('http://localhost:8082/user/getListStudents').subscribe((data: StudentObject[]) => {
            for (const item of data) {
                this.students.push(item.lastName + " " + item.firstName + " " + item.grupa);
            }
        });

        this.getName();
    }


    updateSelectedStudents(target: EventTarget | null, student: string) {
        const checkbox = target as HTMLInputElement;
        const checked = checkbox.checked;

        if (checked) {
            this.selectedStudents.push(student);
        } else {
            const index = this.selectedStudents.indexOf(student);
            if (index !== -1) {
                this.selectedStudents.splice(index, 1);
            }
        }

        console.log(this.selectedStudents)
    }

    selectAll() {
        const checkboxes = document.getElementById("checkboxes");
        if (checkboxes != null) {
            if (!this.expanded) {
                checkboxes.style.display = "none";
                this.expanded = true;
            }
        }
        this.selectedFlag = true;
        this.selectedStudents = this.students;

        this.showSnackbar("Toti studentii sunt selectati.", 'Ok', 5000);

    }

    addMultipleGrades() {
        const formData: any = new FormData();

        const grade = this.form2.get('grade')!.value;
        const subject = this.form2.get('materie')!.value;
        const firstNameList: string[] = [];
        const lastNameList: string[] = [];

        console.log(this.selectedStudents);

        this.selectedStudents.forEach(studentName => {
            firstNameList.push(studentName.split(" ")[0]);
            lastNameList.push(studentName.split(" ")[1]);
        })

        formData.append('grade', grade);
        formData.append('firstName', firstNameList);
        formData.append('lastName', lastNameList);
        formData.append('materie', subject);

        console.log(firstNameList)
        console.log(lastNameList)

        let url = 'http://localhost:8082/Grades/addGradeMultiple';

        this.http.put(url, formData)
            .subscribe({
                next: (response) => {
                    console.log(response);
                    this.showSnackbar("Nota " + grade + " acordată studentilor selectati", 'Ok', 5000);
                },
                error: (error) => {
                    console.log(error);
                    this.showSnackbar("EROARE: Există deja studenți cu note acordate la materia selectată", 'Ok', 5000);
                },
            });
    }

    addGrade(event : MouseEvent) : void {
        const formData: any = new FormData();

        const firstname = this.form1.get('firstName')!.value;
        const lastname = this.form1.get('lastName')!.value;
        const grade = this.form1.get('grade')!.value;
        const subject = this.form1.get('materie')!.value;

        console.log(firstname + " " + lastname + " " + subject + " " + grade);

        if (firstname != "" && subject != "") {
            formData.append('grade', grade);
            formData.append('firstName', firstname);
            formData.append('lastName', lastname);
            formData.append('materie', subject);


            let url = 'http://localhost:8082/Grades/addGrade';
            if (event.toString() == "Buton-update-nota") {
                url = 'http://localhost:8082/Grades/updateGrade';
            }

            this.http.put(url, formData)
                .subscribe({
                    next: (response) => {
                        console.log(response);
                        this.showSnackbar("Nota " + grade + " acordată studentului " + firstname + " " + lastname, 'Ok', 5000);
                    },
                    error: (error) => {
                        console.log(error);
                        this.showSnackbar("EROARE: Studentul " + firstname + " " + lastname + " are deja notă la materia " + subject, 'Ok', 5000);
                    },
                });
        }
    }

    showCheckboxes() {
        const checkboxes = document.getElementById("checkboxes");
        if (checkboxes != null) {
            if (!this.expanded) {
                checkboxes.style.display = "none";
                this.expanded = true;
            } else {
                checkboxes.style.display = "block";
                this.expanded = false;
            }
        }
    }

}
