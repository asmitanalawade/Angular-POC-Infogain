import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {

  loginForm!: FormGroup;
  showPassword = false;
  userData = {};
  errorMessage = '';
  
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)]],
    });
  }

  onSubmit() {
    const userData = this.loginForm.value;
    this.authService.login();
    this.authService.loginData(userData).subscribe(res => {
      if(res.length > 0) {
        this.router.navigateByUrl('/dashboard');
      }else {
        this.errorMessage = "Login failed. Please check your credentials.";
      }
    }, error => {
      this.errorMessage = "Login failed.";
    });
  }

}
