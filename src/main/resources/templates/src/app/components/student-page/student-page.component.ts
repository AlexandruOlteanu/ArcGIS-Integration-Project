import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Calendar} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import {FormBuilder, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {StudentObject} from '../StudentObject'

@Component({
    selector: 'app-student-page',
    templateUrl: './student-page.component.html',
    styleUrls: ['./student-page.component.css']
})
export class StudentPageComponent implements OnInit {
    form: FormGroup;
    calendar!: Calendar;
    name:string = '';

    constructor(public fb: FormBuilder, private http: HttpClient, private snackBar: MatSnackBar) {
        this.form = this.fb.group({
            cnp: [''],
            phone: [''],
            birth: [''],
            iban: [''],
            studies: [''],
            dorm: [''],
            room: ['']
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
        var i:number;
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
    }

    showSnackbar(content: string, action: string, duration: number) {
        this.snackBar.open(content, action, {
            duration: duration,
            verticalPosition: 'bottom',
            horizontalPosition: 'left',
            panelClass: ['snackbar']
        });
    }

    validateDate(e: KeyboardEvent): boolean {
        if (e.key == '/' || /^[0-9]$/i.test(e.key)) {
            return true;
        } else {
            this.showSnackbar("Data nasterii are urmatorul format: DD/MM/YYYY.", "Ok", 4000);
            return false
        }
    }

    validateNo(e: KeyboardEvent): boolean {
        const charCode = e.which ? e.which : e.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            this.showSnackbar("Acest camp permite doar cifre.", "Ok", 4000);
            return false
        }
        return true
    }

    updateInfo() {
        const formData: any = new FormData();
        console.log(this.form.value)

        const formValues = this.form.value;
        const cnp = formValues.cnp;
        const phone = formValues.phone;
        const birth = formValues.birth;
        const iban = formValues.iban;
        const studies = formValues.studies;
        const dorm = formValues.dorm;
        const room = formValues.room;

        formData.append('highSchool', studies);
        formData.append('room', room);
        formData.append('dorm', dorm);
        formData.append('phoneNumber', phone);
        formData.append('cnp', cnp);
        formData.append('birthday', birth);
        formData.append('iban', iban);

        let url = 'http://localhost:8082/user/putData';

        this.http.post(url, formData)
            .subscribe({
                next: (response) => {
                    console.log(response);
                    this.showSnackbar("Datele au fost actualizate cu succes.", 'Ok', 5000);
                },
                error: (error) => {
                    console.log(error);
                    this.showSnackbar("EROARE: Datele nu au putut fi actualizate", 'Ok', 5000);
                },
            });
    }
}
