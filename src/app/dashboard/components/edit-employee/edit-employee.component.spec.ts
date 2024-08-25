import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { EditEmployeeComponent } from './edit-employee.component';
import { EmployeeService } from '../../services/employee.service';
import { of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('EditEmployeeComponent', () => {
  let component: EditEmployeeComponent;
  let fixture: ComponentFixture<EditEmployeeComponent>;
  let employeeService: jasmine.SpyObj<EmployeeService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<EditEmployeeComponent>>;

  const mockData = {
    data: {
      id: "a4bb",
      employeeId: "1",
      name: "Asmita Nalawade",
      designation: "Consultant Development",
      experience: "5.9"
    }
  };

  beforeEach(async () => {
    const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['updateEmployee']);
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule],
      declarations: [EditEmployeeComponent],
      providers: [
        FormBuilder,
        { provide: EmployeeService, useValue: employeeServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EditEmployeeComponent);
    component = fixture.componentInstance;
    employeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<EditEmployeeComponent>>;
    employeeService.updateEmployee.and.returnValue(of({}));
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize edit employee form', () => {
    component.emplyeeForm.setValue(mockData.data);
    expect(component.emplyeeForm.get('employeeId')?.disabled).toBeTrue();
  });

  it('should close the dialog when onCancelClick is called', () => {
    component.onCancelClick();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should call updateEmployee on service when onSave is called with valid form', () => {
    employeeService.updateEmployee.and.returnValue(of({}));

    component.onSave();

    expect(employeeService.updateEmployee).toHaveBeenCalledWith(mockData.data);
  });

  it('should not call updateEmployee on service when form is invalid', () => {
    component.emplyeeForm.patchValue({ name: '' });

    component.onSave();

    expect(employeeService.updateEmployee).not.toHaveBeenCalled();
  });

  it('should enable the employeeId field before calling the service', () => {
    const enableSpy = spyOn(component.emplyeeForm.get('employeeId')!, 'enable');

    employeeService.updateEmployee.and.returnValue(of({}));
    component.onSave();

    expect(enableSpy).toHaveBeenCalled();
  });
});