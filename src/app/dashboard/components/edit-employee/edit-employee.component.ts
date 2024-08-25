import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})
export class EditEmployeeComponent implements OnInit {

  emplyeeForm!: FormGroup;

  constructor(public dialogRef: MatDialogRef<EditEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private service: EmployeeService) {}

  ngOnInit(): void {
    this.emplyeeForm = this.fb.group({
         id: [null],
        employeeId: [{value: '', disabled: true}],
        name: ['', Validators.required],
        designation: [''],
        experience: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]]
    });
    this.emplyeeForm.setValue(this.data.data);
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  onSave() {
    this.emplyeeForm.get('employeeId')?.enable();
    if(this.emplyeeForm.valid) {
      this.service.updateEmployee(this.emplyeeForm.value).subscribe(res => {
        alert('Employee added successfully!!');
      });
    }
  }

}
