import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ChangePasswordComponent } from './change-password.component';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['changePassword']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      declarations: [ChangePasswordComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    authService.changePassword.and.returnValue(of({}));
    component.isOldNewPasswordMatch = false;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty fields and required validators', () => {
    const form = component.changePasswordForm;

    expect(form).toBeDefined();
    expect(form.get('oldPassword')?.valid).toBeFalse();
    expect(form.get('newPassword')?.valid).toBeFalse();
    expect(form.get('confirmPassword')?.valid).toBeFalse();

    expect(form.get('oldPassword')?.hasError('required')).toBeTrue();
    expect(form.get('newPassword')?.hasError('required')).toBeTrue();
    expect(form.get('confirmPassword')?.hasError('required')).toBeTrue();
  });

  it('should validate that the new password and confirm password match', () => {
    const form = component.changePasswordForm;

    form.get('newPassword')?.setValue('Test@1234');
    form.get('confirmPassword')?.setValue('Test@1234');
    fixture.detectChanges();

    expect(form.hasError('passwordMatch')).toBeFalse();

    form.get('confirmPassword')?.setValue('Test@5678');
    fixture.detectChanges();

    expect(form.hasError('passwordMatch')).toBeTrue();
  });

  it('should toggle new password visibility', () => {
    component.togglePasswordVisibility();

    expect(component.showPassword).toBeTrue();
    expect((document.getElementById('newPassword') as HTMLInputElement).type).toBe('text');

    component.togglePasswordVisibility();

    expect(component.showPassword).toBeFalse();
    expect((document.getElementById('newPassword') as HTMLInputElement).type).toBe('password');
  });

  it('should toggle confirm password visibility', () => {
    component.toggleConfirmPasswordVisibility();

    expect(component.showConfirmPassword).toBeTrue();
    expect((document.getElementById('confirmPassword') as HTMLInputElement).type).toBe('text');

    component.toggleConfirmPasswordVisibility();

    expect(component.showConfirmPassword).toBeFalse();
    expect((document.getElementById('confirmPassword') as HTMLInputElement).type).toBe('password');
  });

  it('should detect if the old password matches the new password', fakeAsync(() => {
    const form = component.changePasswordForm;
    form.get('oldPassword')?.setValue('Test@1234');
    form.get('newPassword')?.setValue('Test@1234');

    component.checkPasswordMatch();
    tick(300);

    fixture.detectChanges();
    expect(component.isOldNewPasswordMatch).toBeTruthy();

    form.get('newPassword')?.setValue('Test@5678');

    component.checkPasswordMatch();
    tick(300);

    fixture.detectChanges();
    expect(component.isOldNewPasswordMatch).toBeFalse();
  }));

  it('should call changePassword on authService when form is submitted and passwords do not match', () => {
    const form = component.changePasswordForm;
    component.isOldNewPasswordMatch = false;
    form.get('oldPassword')?.setValue('Old@1234');
    form.get('newPassword')?.setValue('New@5678');
    form.get('confirmPassword')?.setValue('New@5678');

    authService.changePassword.and.returnValue(of({id: "28e1", name: "Asmita", email: "asmita12@gmail.com", password: "New@5678"}));

    component.onSubmit();

    expect(authService.changePassword).toHaveBeenCalledWith('Old@1234', 'New@5678');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
    expect(localStorage.getItem('loggedIn')).toBe('false');
  });
});