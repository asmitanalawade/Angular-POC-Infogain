import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent {
  emplyeeForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<AddEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private service: EmployeeService) { 
      this.emplyeeForm = this.fb.group({
        employeeId: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
        name: ['', Validators.required],
        designation: [''],
        experience: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]]
      });
    }

  onCancelClick() {
    this.dialogRef.close();
  }

  onSave() {
    if(this.emplyeeForm.valid) {
      this.service.addEmployee(this.emplyeeForm.value).subscribe(res => {
        alert('Employee added successfully!!');
      });
    }
  }

}
