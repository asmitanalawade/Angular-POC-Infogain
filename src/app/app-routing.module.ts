import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeTableComponent } from './dashboard/components/employee-table/employee-table.component';
import { ChangePasswordComponent } from './login/components/change-password/change-password.component';
import { SignUpComponent } from './login/components/sign-up/sign-up.component';
import { UserLoginComponent } from './login/components/user-login/user-login.component';
import { AuthGuard } from './login/services/auth.guard';

const routes: Routes = [
  {path: '', component: UserLoginComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'forget-password', component: ChangePasswordComponent},
  {path: 'dashboard', component: EmployeeTableComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
