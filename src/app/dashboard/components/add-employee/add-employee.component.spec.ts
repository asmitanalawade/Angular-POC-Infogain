import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
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
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockEmployeeService = jasmine.createSpyObj('EmployeeService', ['getEmployees', 'addEmployee']);

    await TestBed.configureTestingModule({
      declarations: [AddEmployeeComponent],
      imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: EmployeeService, useValue: mockEmployeeService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeeComponent);
    component = fixture.componentInstance;

    mockEmployeeService.getEmployees.and.returnValue(of([{ employeeId: '1', name: 'Test', designation: 'Developer', experience: '5' }]));
    
    fixture.detectChanges(); // ngOnInit is called here
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize employeeList on ngOnInit', () => {
    expect(component.employeeList.length).toBe(1);
    expect(component.employeeList[0].name).toBe('Test');
  });

  it('should match an existing employee ID', fakeAsync(() => {
    component.emplyeeForm.controls['employeeId'].setValue('1');

    component.checkEmployeeIdMatch();
    tick(300);

    expect(component.isEmployeeIdMatch).toBeTrue();
  }));

  it('should not match an employee ID if it does not exist', () => {
    component.emplyeeForm.controls['employeeId'].setValue('2');
    component.checkEmployeeIdMatch();
    expect(component.isEmployeeIdMatch).toBeFalse();
  });

  it('should match an existing employee name', fakeAsync(() => {
    component.emplyeeForm.controls['name'].setValue('Test');

    component.checkNameMatch();
    tick(300);
    
    expect(component.isNameMatch).toBeTrue();
  }));

  it('should not match an employee name if it does not exist', () => {
    component.emplyeeForm.controls['name'].setValue('Test');
    component.checkNameMatch();
    expect(component.isNameMatch).toBeFalse();
  });

  it('should call addEmployee when onSave is called with valid data and no matches', () => {
    component.isEmployeeIdMatch = false;
    component.isNameMatch = false;
    component.emplyeeForm.controls['employeeId'].setValue('2');
    component.emplyeeForm.controls['name'].setValue('Test');
    component.emplyeeForm.controls['designation'].setValue('Tester');
    component.emplyeeForm.controls['experience'].setValue('3');

    mockEmployeeService.addEmployee.and.returnValue(of({}));

    component.onSave();

    expect(mockEmployeeService.addEmployee).toHaveBeenCalledWith({
      employeeId: '2',
      name: 'Test',
      designation: 'Tester',
      experience: '3',
    });
  });

  it('should not call addEmployee when onSave is called with existing employee ID or name', () => {
    component.isEmployeeIdMatch = true;
    component.isNameMatch = true;
    component.emplyeeForm.controls['employeeId'].setValue('1');
    component.emplyeeForm.controls['name'].setValue('Test');

    component.onSave();

    expect(mockEmployeeService.addEmployee).not.toHaveBeenCalled();
  });

  it('should close the dialog when onCancelClick is called', () => {
    component.onCancelClick();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});