import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeTableComponent } from './employee-table.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('EmployeeTableComponent', () => {
  let component: EmployeeTableComponent;
  let fixture: ComponentFixture<EmployeeTableComponent>;
  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockEmployeeService = jasmine.createSpyObj('EmployeeService', ['getEmployees']);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [EmployeeTableComponent],
      imports: [
        MatTableModule,
        MatPaginatorModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: Router, useValue: mockRouter },
        { provide: MatDialog, useValue: mockDialog },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTableComponent);
    component = fixture.componentInstance;
    mockEmployeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    mockEmployeeService.getEmployees.and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and populate the employee list on initialization', () => {
    const mockEmployeeList = [
      { id: '1', employeeId: '1', name: 'Admin', designation: 'Developer', experience: '3 years' },
      { id: '2', employeeId: '2', name: 'Test', designation: 'Designer', experience: '5 years' }
    ];

    mockEmployeeService.getEmployees.and.returnValue(of(mockEmployeeList));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.employeeList).toEqual(mockEmployeeList);
    expect(component.dataSource.data).toEqual(mockEmployeeList);
    expect(mockEmployeeService.getEmployees).toHaveBeenCalled();
  });

  it('should open AddEmployeeComponent dialog on openDialog()', () => {
    const dialogRefSpy = jasmine.createSpyObj({ afterClosed: of(true) });
    mockDialog.open.and.returnValue(dialogRefSpy);

    component.openDialog();
    expect(mockDialog.open).toHaveBeenCalled();
    expect(dialogRefSpy.afterClosed).toHaveBeenCalled();
  });

  it('should open EditEmployeeComponent dialog on editEmployee()', () => {
    const mockRowData = { id: '1', employeeId: '1', name: 'Admin', designation: 'Developer', experience: '3 years' };
    const dialogRefSpy = jasmine.createSpyObj({ afterClosed: of(true) });
    mockDialog.open.and.returnValue(dialogRefSpy);

    component.editEmployee(mockRowData);
    expect(mockDialog.open).toHaveBeenCalled();
    expect(dialogRefSpy.afterClosed).toHaveBeenCalled();
  });

  it('should open DeleteEmployeeComponent dialog on deleteEmployee()', () => {
    const mockRowData = { id: '1', employeeId: '1', name: 'Test', designation: 'Developer', experience: '3 years' };
    const dialogRefSpy = jasmine.createSpyObj({ afterClosed: of(true) });
    mockDialog.open.and.returnValue(dialogRefSpy);

    component.deleteEmployee(mockRowData);
    expect(mockDialog.open).toHaveBeenCalled();
    expect(dialogRefSpy.afterClosed).toHaveBeenCalled();
  });

  it('should logout and navigate to the root URL', () => {
    component.logout();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
    expect(localStorage.getItem('loggedIn')).toBe('false');
  });
});
