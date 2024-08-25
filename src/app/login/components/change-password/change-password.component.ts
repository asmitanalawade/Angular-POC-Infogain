import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { AuthService } from '../../services/auth.service';

interface UserData{
  userId: number;
  oldPassword: string;
  newPassword: string;
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  showPassword = false;
  showConfirmPassword =false;
  userData!: UserData;
  errorMessage = '';
  isOldNewPasswordMatch = false;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) { 
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)]],
      newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)]]
    },
     {
       validator: this.passwordMatch
     }
     );
  }

  ngOnInit(): void {
    this.checkPasswordMatch();
  }

  passwordMatch = (formGroup: FormGroup): ValidationErrors | undefined => {
    const passwordControl = formGroup.get('newPassword');
    const confirmPasswordControl = formGroup.get('confirmPassword');
  
    if(passwordControl?.value === confirmPasswordControl?.value){
      return;      
    } else {
      return {
        passwordMatch: true
      }
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    const passwordField = document.getElementById('newPassword') as HTMLInputElement;
    passwordField.type = this.showPassword ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
    const passwordField = document.getElementById('confirmPassword') as HTMLInputElement;
    passwordField.type = this.showConfirmPassword ? 'text' : 'password';
  }

  checkPasswordMatch() {
    this.changePasswordForm.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      const oldPassword = this.changePasswordForm.get('oldPassword')?.value;
      const newPassword = this.changePasswordForm.get('newPassword')?.value;

      this.isOldNewPasswordMatch = oldPassword === newPassword;
    });
  }

  onSubmit() {
    console.log(this.changePasswordForm);
    this.userData = this.changePasswordForm.value;
    if(!this.isOldNewPasswordMatch) {
      this.authService.changePassword(this.userData.oldPassword, this.userData.newPassword).subscribe(res => {
        if(res.error) {
          this.errorMessage = res.error;
        }else {
          this.router.navigateByUrl('/');
          localStorage.setItem('loggedIn', 'false');
        }
      });
    }
  }
}
