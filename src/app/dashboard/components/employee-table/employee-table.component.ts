import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { DeleteEmployeeComponent } from '../delete-employee/delete-employee.component';
import { EditEmployeeComponent } from '../edit-employee/edit-employee.component';

export interface UserData {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  experience: string;
}

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.scss']
})

export class EmployeeTableComponent implements OnInit {

  displayedColumns: string[] = ['employeeId', 'name', 'designation', 'experience', 'action'];
  dataSource!: MatTableDataSource<UserData>;
  employeeList: any;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(public dialog: MatDialog, private service: EmployeeService, private router: Router) {}

  ngOnInit(): void {
    this.getAllEmployee();
  }

  getAllEmployee() {
    this.service.getEmployees().subscribe(res => {
      this.employeeList = res;
      this.dataSource = new MatTableDataSource(this.employeeList);
      this.dataSource.paginator = this.paginator;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddEmployeeComponent, {
      width: '250px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllEmployee();
    });
  }

  editEmployee(row: any) {
    const dialogRef = this.dialog.open(EditEmployeeComponent, {
      width: '250px',
      data: {data: row},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllEmployee();
    });
  }

  deleteEmployee(row: any) {
    const dialogRef = this.dialog.open(DeleteEmployeeComponent, {
      width: '250px',
      data: {data: row},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllEmployee();
    });
  }

  logout() {
    this.router.navigateByUrl('/');
    localStorage.setItem('loggedIn', 'false');
  }
}
