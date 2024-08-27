import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { DeleteEmployeeComponent } from './delete-employee.component';
import { EmployeeService } from '../../services/employee.service';
import { MatButtonModule } from '@angular/material/button';

describe('DeleteEmployeeComponent', () => {
  let component: DeleteEmployeeComponent;
  let fixture: ComponentFixture<DeleteEmployeeComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<DeleteEmployeeComponent>>;
  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;
  
  const mockData = { data: { id: "1", employeeId: "1", name: "smita", designation: "ghgh", experience: "7" } };

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockEmployeeService = jasmine.createSpyObj('EmployeeService', ['deleteEmployee']);

    await TestBed.configureTestingModule({
      declarations: [DeleteEmployeeComponent],
      imports:[MatButtonModule, MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: EmployeeService, useValue: mockEmployeeService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog on onNoClick', () => {
    component.onNoClick();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should call deleteEmployee on the service with the correct id on onSave', () => {
    mockEmployeeService.deleteEmployee.and.returnValue(of({}));

    component.onSave();

    expect(mockEmployeeService.deleteEmployee).toHaveBeenCalledWith('1');
  });

  it('should show an alert when employee is deleted successfully', () => {
    spyOn(window, 'alert');
    mockEmployeeService.deleteEmployee.and.returnValue(of({}));

    component.onSave();

    expect(window.alert).toHaveBeenCalledWith('Employee deleted successfully!!');
  });
});