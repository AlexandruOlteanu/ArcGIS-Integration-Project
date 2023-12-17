import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AdminPageComponent} from './components/admin-page/admin-page.component';
import {LoginPageComponent} from './components/login-page/login-page.component';
import {ProfessorPageComponent} from './components/professor-page/professor-page.component';
import {StudentPageComponent} from './components/student-page/student-page.component';
import {ChangePassw1Component} from './components/change-passw1/change-passw1.component';
import {ChangePassw2Component} from './components/change-passw2/change-passw2.component';
import {GradesPageComponent} from './components/grades-page/grades-page.component';

const routes: Routes = [
    {path: "", redirectTo: "login", pathMatch: "full"},
    {path: "login", component: LoginPageComponent},
    {path: "admin", component: AdminPageComponent},
    {path: "professor", component: ProfessorPageComponent},
    {path: "student", component: StudentPageComponent},
    {path: "change_passw1", component: ChangePassw1Component},
    {path: "change_passw2", component: ChangePassw2Component},
    {path: "grades", component: GradesPageComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
