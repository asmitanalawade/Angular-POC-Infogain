import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private api = 'http://localhost:4000/employees';

  constructor( private http: HttpClient) { }


  addEmployee(employee: any): Observable<any> {
    return this.http.post(this.api, employee).pipe(map(res => res));
  }

  getEmployees(): Observable<any> {
    return this.http.get(this.api).pipe(map(res => res));
  }

  updateEmployee(employee: any): Observable<any> {
    return this.http.put(`${this.api}/${employee.id}`, employee).pipe(map(res => res));
  }

  deleteEmployee(id: any): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }

}
