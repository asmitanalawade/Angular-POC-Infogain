import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime } from 'rxjs';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  emplyeeForm: FormGroup;
  employeeList: any;
  isEmployeeIdMatch = false;
  isNameMatch = false;

  constructor(public dialogRef: MatDialogRef<AddEmployeeComponent>,
    private fb: FormBuilder, private service: EmployeeService) { 
      this.emplyeeForm = this.fb.group({
        employeeId: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
        name: ['', Validators.required],
        designation: [''],
        experience: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]]
      });
    }

  ngOnInit(): void {
    this.service.getEmployees().subscribe(res => {
      this.employeeList = res;
    });
    this.checkEmployeeIdMatch();
    this.checkNameMatch();
  }

  checkEmployeeIdMatch() {
    this.emplyeeForm.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      const employeeId = this.emplyeeForm.get('employeeId')?.value;
      this.isEmployeeIdMatch = this.employeeList.some((val: any) => val.employeeId === employeeId);
    });
  }

  checkNameMatch() {
    this.emplyeeForm.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      const name = this.emplyeeForm.get('name')?.value.trim().toLowerCase();
      this.isNameMatch = this.employeeList.some((val: any) => val.name.trim().toLowerCase() === name);
    });
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  onSave() {
    if(this.emplyeeForm.valid && !this.isNameMatch && !this.isEmployeeIdMatch) {
      this.service.addEmployee(this.emplyeeForm.value).subscribe(res => {
        alert('Employee added successfully!!');
      });
    }
  }

}
