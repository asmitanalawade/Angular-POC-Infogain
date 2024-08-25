import { formatNumber } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';

import { SignUpComponent } from './sign-up.component';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authserviceSpy = jasmine.createSpyObj('AuthService', ['signUp']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      declarations: [ SignUpComponent ],
      imports: [ReactiveFormsModule],
      providers:[
        {provide: AuthService, useValue: authserviceSpy},
        {provide: Router, useValue: routerSpy},
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize sign up form', () => {
    const form = component.signUpGroup;
    expect(form).toBeDefined();
    expect(form.get('name')?.value).toEqual('');
    expect(form.get('email')?.value).toEqual('');
    expect(form.get('password')?.value).toEqual('');
    expect(form.get('confirmPassword')?.value).toEqual('');
  });

  it('should validate the input fields', () => {
    const form = component.signUpGroup;

    form.get('name')?.setValue('');
    form.get('email')?.setValue('test');
    form.get('password')?.setValue('test');
    form.get('confirmPassword')?.setValue('test');

    expect(form.get('name')?.valid).toBeFalsy();
    expect(form.get('email')?.valid).toBeFalsy();
    expect(form.get('password')?.valid).toBeFalsy();
    expect(form.get('confirmPassword')?.valid).toBeFalsy();

    form.get('name')?.setValue('Test');
    form.get('email')?.setValue('test@gmail.com');
    form.get('password')?.setValue('Test@1234');
    form.get('confirmPassword')?.setValue('Test@1234');

    expect(form.get('name')?.valid).toBeTruthy();
    expect(form.get('email')?.valid).toBeTruthy();
    expect(form.get('password')?.valid).toBeTruthy();
    expect(form.get('confirmPassword')?.valid).toBeTruthy();
  });

  it('should validate the password and confirmed password match', () => {
    const form = component.signUpGroup;

    form.get('password')?.setValue('Test@12345');
    form.get('confirmPassword')?.setValue('Test@12345');

    expect(form.hasError('passwordMatch')).toBeFalsy();

    form.get('confirmPassword')?.setValue('Test@98765');
    expect(form.hasError('passwordMatch')).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    component.togglePasswordVisibility();

    expect(component.showPassword).toBeTrue();
    expect((document.getElementById('password') as HTMLInputElement).type).toBe('text');

    component.togglePasswordVisibility();

    expect(component.showPassword).toBeFalse();
    expect((document.getElementById('password') as HTMLInputElement).type).toBe('password');
  });

  it('should toggle confirm password visibility', () => {
    component.toggleConfirmPasswordVisibility();

    expect(component.showConfirmPassword).toBeTrue();
    expect((document.getElementById('confirmPassword') as HTMLInputElement).type).toBe('text');

    component.toggleConfirmPasswordVisibility();

    expect(component.showConfirmPassword).toBeFalse();
    expect((document.getElementById('confirmPassword') as HTMLInputElement).type).toBe('password');
  });

  it('should call signUp when form is valid', () => {
    const form = component.signUpGroup;

    const userData = {name:'Test', email: 'test@gmail.com', password: 'Test@1234', confirmPassword: 'Test@1234'};
    form.setValue(userData);

    authService.signUp.and.returnValue(of({}));

    component.onSubmit();

    expect(authService.signUp).toHaveBeenCalledWith({
      name:'Test', email: 'test@gmail.com', password: 'Test@1234'
    })
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should not call signUp when form is invalid', () => {
    const form = component.signUpGroup;

    const userData = {name:'Test', email: 'testgmail.com', password: 'Test@12', confirmPassword: 'Test@1234'};
    form.setValue(userData);

    component.onSubmit();

    expect(authService.signUp).not.toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
