import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { EmployeeService } from './employee.service';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmployeeService]
    });
    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addEmployee', () => {
    it('should post user data to the API', () => {
      const user = { employeeId: 1,
                      name: "Asmita Nalawade",
                      designation: "Consultant Development",
                      experience: 5.8
                    };
      service.addEmployee(user).subscribe(response => {
        expect(response).toEqual(user);
      });

      const req = httpMock.expectOne('http://localhost:4000/employees');
      expect(req.request.method).toBe('POST');
      req.flush(user);
    });
  });

  describe('getEmployees', () => {
    it('should get user data from the API', () => {
      const user = [
        {
          "id": "a4bb",
          "employeeId": "1",
          "name": "Asmita Nalawade",
          "designation": "Consultant Development",
          "experience": "5.8"
        },
        {
          "id": "aad1",
          "employeeId": "2",
          "name": "Ahmed Raja",
          "designation": "Senior frontend developer",
          "experience": "12"
        }
      ];
      service.getEmployees().subscribe(response => {
        expect(response).toEqual(user);
      });

      const req = httpMock.expectOne('http://localhost:4000/employees');
      expect(req.request.method).toBe('GET');
      req.flush(user);
    });
  });

  describe('updateEmployee', () => {
    it('should put user data to the API', () => {
      const user = { id: "aad1",
                      employeeId: "2",
                      name: "Ahmed Raja",
                      designation: "Senior frontend developer",
                      experience: "12"
                    };
      service.updateEmployee(user).subscribe(response => {
        expect(response).toEqual(user);
      });

      const api = 'http://localhost:4000/employees';
      const req = httpMock.expectOne(`${api}/${user.id}`);
      expect(req.request.method).toBe('PUT');
      req.flush(user);
    });
  });

  describe('deleteEmployee', () => {
    it('should put user data to the API', () => {
      const user = { id: "aad1",
                      employeeId: "2",
                      name: "Ahmed Raja",
                      designation: "Senior frontend developer",
                      experience: "12"
                    };
      service.deleteEmployee(user.id).subscribe(response => {
        expect(response).toEqual(user);
      });

      const api = 'http://localhost:4000/employees';
      const req = httpMock.expectOne(`${api}/${user.id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(user);
    });
  });
});
