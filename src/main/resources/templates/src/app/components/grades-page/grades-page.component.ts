import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {GradeObject} from "../GradeObject";
import {Calendar} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";

@Component({
    selector: 'app-grades-page',
    templateUrl: './grades-page.component.html',
    styleUrls: ['./grades-page.component.css']
})
export class GradesPageComponent {
    strings: string[] = [];
    grades: GradeObject[] = [];
    name: string = '';
    formGrades: FormGroup;
    calendar!: Calendar;
    firstName: string = '';
    lastName: string = '';

    subject_names: { [key: number]: string } = {};

    averageGrade: number = 0;

    constructor(public fb: FormBuilder, private http: HttpClient, private snackBar: MatSnackBar) {
        this.formGrades = this.fb.group({
            firstName: [''],
            lastName: [''],
        });
    }

    getName() {
        this.http.get<any>('http://localhost:8082/user/getUserStudent').subscribe(
            response => {
                this.name = response.lastName + " " + response.firstName;
            },
            error => {
                console.error('Error fetching data:', error);
            }
        );
    }

    ngOnInit(): void {
        var i: number;
        const calendarEl = document.getElementById('calendar');
        if (calendarEl) {
            const events: { title: string; date: string }[] = [];

            const startDate = new Date('2022-12-24');
            const endDate = new Date('2023-01-08');
            const currentDate = new Date(startDate);

            while (currentDate <= endDate) {
                events.push({
                    title: 'Vacanta iarna',
                    date: currentDate.toISOString().split('T')[0]
                });

                currentDate.setDate(currentDate.getDate() + 1);
            }

            const startDate1 = new Date('2023-01-21');
            const endDate1 = new Date('2023-02-10');
            const currentDate1 = new Date(startDate1);

            while (currentDate1 <= endDate1) {
                events.push({
                    title: 'Sesiunea de examene',
                    date: currentDate1.toISOString().split('T')[0]
                });

                currentDate1.setDate(currentDate1.getDate() + 1);
            }

            const startDate2 = new Date('2023-02-11');
            const endDate2 = new Date('2023-02-26');
            const currentDate2 = new Date(startDate2);

            while (currentDate2 <= endDate2) {
                events.push({
                    title: 'Vacanta inter-semestriala',
                    date: currentDate2.toISOString().split('T')[0]
                });

                currentDate2.setDate(currentDate2.getDate() + 1);
            }

            events.push({
                title: "Semestrul II",
                date: '2023-02-27'
            })

            const startDate3 = new Date('2023-06-03');
            const endDate3 = new Date('2023-06-23');
            const currentDate3 = new Date(startDate3);

            while (currentDate3 <= endDate3) {
                events.push({
                    title: 'Sesiunea de examene',
                    date: currentDate3.toISOString().split('T')[0]
                });

                currentDate3.setDate(currentDate3.getDate() + 1);
            }

            const startDate4 = new Date('2023-06-26');
            const endDate4 = new Date('2023-10-02');
            const currentDate4 = new Date(startDate4);

            while (currentDate4 <= endDate4) {
                events.push({
                    title: 'Vacanta de vara',
                    date: currentDate4.toISOString().split('T')[0]
                });

                currentDate4.setDate(currentDate4.getDate() + 1);
            }

            this.calendar = new Calendar(calendarEl, {
                plugins: [dayGridPlugin],
                initialView: 'dayGridMonth',
                events
            });
            this.calendar.render();
        }

        this.getName()

        this.http.get<GradeObject[]>('http://localhost:8082/Grades/getGradesForTabel').subscribe((data: GradeObject[]) => {
            for (const item of data) {
                this.grades.push(item);
                this.averageGrade += item.grade;
                console.log(item.grade)
            }
            this.averageGrade /= this.grades.length;
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

    sortGradesDescending() {
        let i, j;
        for (i = 0; i < this.grades.length - 1; ++i) {
            for (j = i + 1; j < this.grades.length; ++j) {
                if (this.grades[i].grade < this.grades[j].grade) {
                    let aux = this.grades[i];
                    this.grades[i] = this.grades[j];
                    this.grades[j] = aux;
                }
            }
        }
    }

    sortGradesAscending() {
        let i, j;
        for (i = 0; i < this.grades.length - 1; ++i) {
            for (j = i + 1; j < this.grades.length; ++j) {
                if (this.grades[i].grade > this.grades[j].grade) {
                    let aux = this.grades[i];
                    this.grades[i] = this.grades[j];
                    this.grades[j] = aux;
                }
            }
        }
    }

    flagGrade(nameMaterie : string) {
        const formData = new FormData();
        formData.append("materie", nameMaterie);

        this.http.put("http://localhost:8082/class/addFlag", formData).subscribe({
            next: (response) => {
                console.log(response);
                this.showSnackbar('Notă marcata.', 'Ok', 5000);
            },
            error: (error) => {
                console.log(error);
                this.showSnackbar('EROARE: Marcajul nu a fost realizat cu succes.', 'Ok', 5000);
            },
        })
    }
}
