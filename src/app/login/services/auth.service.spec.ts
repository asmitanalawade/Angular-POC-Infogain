import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('loggedIn');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isAuthenticated', () => {
    it('should return true if loggedIn is set to true in localStorage', () => {
      localStorage.setItem('loggedIn', 'true');
      expect(service.isAuthenticated()).toBeTrue();
    });

    it('should return false if loggedIn is not set or set to false in localStorage', () => {
      localStorage.setItem('loggedIn', 'false');
      expect(service.isAuthenticated()).toBeFalse();
    });
  });

  describe('login', () => {
    it('should set loggedIn to true in localStorage', () => {
      service.login();
      expect(localStorage.getItem('loggedIn')).toBe('true');
    });
  });

  describe('signUp', () => {
    it('should post user data to the API', () => {
      const user = { name:'test', email: 'test@example.com', password: 'test@123' };
      service.signUp(user).subscribe(response => {
        expect(response).toEqual(user);
      });

      const req = httpMock.expectOne('http://localhost:4000/users');
      expect(req.request.method).toBe('POST');
      req.flush(user);
    });
  });

  describe('loginData', () => {
    it('should set loggedIn to true if user data is returned', () => {
      const data = { email: 'test@example.com', password: '12345' };
      const mockResponse = [{ id: '1', email: 'test@example.com', password: '12345' }];

      service.loginData(data).subscribe(() => {
        expect(service['loggedIn']).toBeTrue();
      });

      const req = httpMock.expectOne(`http://localhost:4000/users?email=${data.email}&password=${data.password}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should set loggedIn to false if no user data is returned', () => {
      const data = { email: 'test@example.com', password: '12345' };
      service.loginData(data).subscribe(() => {
        expect(service['loggedIn']).toBeFalse();
      });

      const req = httpMock.expectOne(`http://localhost:4000/users?email=${data.email}&password=${data.password}`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('changePassword', () => {
    it('should change password if old password is correct', () => {
      const oldPassword = 'oldPass';
      const newPassword = 'newPass';
      const mockUsers = [{ id: '1', name: 'test', email:'test@123', password: oldPassword }];

      service.changePassword(oldPassword, newPassword).subscribe(response => {
        expect(response).toEqual({ id: '1', name: 'test', email:'test@123', password: newPassword });
      });

      const req = httpMock.expectOne('http://localhost:4000/users');
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);

      const putReq = httpMock.expectOne('http://localhost:4000/users/1');
      expect(putReq.request.method).toBe('PUT');
      putReq.flush({ id: '1', name: 'test', email:'test@123', password: newPassword });
    });

    it('should return an error if old password is incorrect', () => {
      const oldPassword = 'wrongPass';
      const newPassword = 'newPass';
      const mockUsers = [{ id: '1', name: 'test', email:'test@123', password: 'correctPass' }];

      service.changePassword(oldPassword, newPassword).subscribe(response => {
        expect(response).toEqual({ error: 'Old password is incorrect' });
      });

      const req = httpMock.expectOne('http://localhost:4000/users');
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });
  });
});
