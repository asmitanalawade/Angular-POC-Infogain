import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  signUpGroup: FormGroup;
  showPassword = false;
  showConfirmPassword =false;
  userData = {};

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { 
    this.signUpGroup = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)]]
    },
     {
       validator: this.passwordMatch
     }
     );
  }

  passwordMatch = (formGroup: FormGroup): ValidationErrors | undefined => {
    const passwordControl = formGroup.get('password');
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
    const passwordField = document.getElementById('password') as HTMLInputElement;
    passwordField.type = this.showPassword ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
    const passwordField = document.getElementById('confirmPassword') as HTMLInputElement;
    passwordField.type = this.showConfirmPassword ? 'text' : 'password';
  }

  onSubmit() {
    this.userData = {
      name: this.signUpGroup.value.name,
      email: this.signUpGroup.value.email,
      password: this.signUpGroup.value.password,
    } 
    if(this.signUpGroup.valid){
      this.authService.signUp(this.userData).subscribe(res => {
        this.router.navigateByUrl('/');
      });
    }
  }

}
