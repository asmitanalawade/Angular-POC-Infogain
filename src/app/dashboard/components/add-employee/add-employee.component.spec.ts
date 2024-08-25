import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { EmployeeService } from '../../services/employee.service';
import { AddEmployeeComponent } from './add-employee.component';

describe('AddEmployeeComponent', () => {
  let component: AddEmployeeComponent;
  let fixture: ComponentFixture<AddEmployeeComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<AddEmployeeComponent>>;
  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;

  beforeEach(async () => {
    const mockDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    const mockEmployeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['addEmployee']);

    await TestBed.configureTestingModule({
      declarations: [AddEmployeeComponent],
      imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: mockDialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: EmployeeService, useValue: mockEmployeeServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AddEmployeeComponent);
    component = fixture.componentInstance;
    mockDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<AddEmployeeComponent>>;
    mockEmployeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
    mockEmployeeService.addEmployee.and.returnValue(of({}));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    const form = component.emplyeeForm;
    expect(form).toBeDefined();
    expect(form.get('employeeId')?.value).toEqual('');
    expect(form.get('name')?.value).toEqual('');
    expect(form.get('designation')?.value).toEqual('');
    expect(form.get('experience')?.value).toEqual('');
  });

  it('should close the dialog on onCancelClick', () => {
    component.onCancelClick();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should call addEmployee on the service with form data when form is valid and onSave is called', () => {
    mockEmployeeService.addEmployee.and.returnValue(of({}));

    component.emplyeeForm.setValue({
      employeeId: '123',
      name: 'John Doe',
      designation: 'Engineer',
      experience: '5'
    });

    component.onSave();

    expect(mockEmployeeService.addEmployee).toHaveBeenCalledWith({
      employeeId: '123',
      name: 'John Doe',
      designation: 'Engineer',
      experience: '5'
    });
  });

  it('should show an alert when employee is added successfully', () => {
    spyOn(window, 'alert');
    mockEmployeeService.addEmployee.and.returnValue(of({}));

    component.emplyeeForm.setValue({
      employeeId: '123',
      name: 'John Doe',
      designation: 'Engineer',
      experience: '5'
    });

    component.onSave();

    expect(window.alert).toHaveBeenCalledWith('Employee added successfully!!');
  });

  it('should not call addEmployee on the service if the form is invalid', () => {
    component.emplyeeForm.setValue({
      employeeId: '123',
      name: '',
      designation: 'Engineer',
      experience: '5'
    });

    component.onSave();

    expect(component.emplyeeForm.valid).toBeFalse();
    expect(mockEmployeeService.addEmployee).not.toHaveBeenCalled();
  });
});