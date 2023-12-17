import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {LoginPageComponent} from './components/login-page/login-page.component';
import {AdminPageComponent} from './components/admin-page/admin-page.component';
import {ProfessorPageComponent} from './components/professor-page/professor-page.component';
import {CorsInterceptor} from "./cors.interceptor";
import {ChangePassw1Component} from './components/change-passw1/change-passw1.component';
import {ChangePassw2Component} from './components/change-passw2/change-passw2.component';
import {ReactiveFormsModule} from '@angular/forms';
// import {BasicSnackbarComponent} from './components/basic-snackbar/basic-snackbar.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {StudentPageComponent} from "./components/student-page/student-page.component";
import { GradesPageComponent } from './components/grades-page/grades-page.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginPageComponent,
        AdminPageComponent,
        ProfessorPageComponent,
        ChangePassw1Component,
        ChangePassw2Component,
        StudentPageComponent,
        GradesPageComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        BrowserAnimationsModule
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: CorsInterceptor, multi: true},
        MatSnackBarModule
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
    constructor(private httpClient: HttpClient) {
        // Set CORS configuration
        // this.configureCORS();
    }

    //
    // private configureCORS(): void {
    //     this.httpClient.defaults.withCredentials = true;
    //     this.httpClient.defaults.headers['Access-Control-Allow-Origin'] = '*';
    //     // You can also set other CORS-related headers if needed
    // }
}
