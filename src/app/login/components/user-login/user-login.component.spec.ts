import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';

import { UserLoginComponent } from './user-login.component';

describe('UserLoginComponent', () => {
  let component: UserLoginComponent;
  let fixture: ComponentFixture<UserLoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'loginData']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      declarations: [ UserLoginComponent ],
      imports: [
        ReactiveFormsModule,
        HttpClientModule
      ],
      providers: [
        {provide: AuthService, useValue: authServiceSpy},
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserLoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should initialize the login form with default value', () => {
    const loginForm = component.loginForm;
    expect(loginForm).toBeDefined();
    expect(loginForm.get('email')?.value).toEqual('');
    expect(loginForm.get('password')?.value).toEqual('');
  });

  it('Should validate the form field', () => {
    const loginForm = component.loginForm;
    loginForm.get('email')?.setValue('invalidEmail.com');
    loginForm.get('password')?.setValue('password');

    expect(loginForm.get('email')?.valid).toBeFalsy();
    expect(loginForm.get('password')?.valid).toBeFalsy();

    loginForm.get('email')?.setValue('test@gmail.com');
    loginForm.get('password')?.setValue('Test@1234');

    expect(loginForm.get('email')?.valid).toBeTruthy();
    expect(loginForm.get('password')?.valid).toBeTruthy();
  });

  it('Should call login and loginData and navigate to dashboard on success', () => {
    const loginForm = component.loginForm;
    const userData = {email: 'test@gmail.com', password: 'Test@1234'};
    loginForm.setValue(userData);
    authService.login();
    authService.loginData.and.returnValue(of([{id: '1', name:'Test', email: 'test@gmail.com', password: 'Test@1234'}]));

    component.onSubmit();

    expect(authService.login).toHaveBeenCalled();
    expect(authService.loginData).toHaveBeenCalledWith(userData);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
    expect(component.errorMessage).toEqual('');
  });

  it('should show error message on login failure', () => {
    const loginForm = component.loginForm;
    const userData = {email: 'any@gmail.com', password: 'Any@1234'};
    loginForm.setValue(userData);
    authService.loginData.and.returnValue(of([]));

    component.onSubmit();

    expect(authService.login).toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Login failed. Please check your credentials.');
  });

  it('should show error message on login failure', () => {
    const loginForm = component.loginForm;
    const userData = {email: 'any@gmail.com', password: 'Any@1234'};
    loginForm.setValue(userData);
    authService.loginData.and.returnValue(throwError({error: 'server error'}));

    component.onSubmit();

    expect(authService.login).toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Login failed.');
  });
});
