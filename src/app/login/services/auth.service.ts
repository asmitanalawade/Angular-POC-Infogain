import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = "http://localhost:4000/users";
  private loggedIn = false; 

  constructor(private http: HttpClient) {}

  isAuthenticated(): boolean {
    this.loggedIn = localStorage.getItem('loggedIn') === 'true' ? true : false;
    return this.loggedIn;
  }

  login() {
    localStorage.setItem('loggedIn', 'true');
  }

  signUp(user: any): Observable<any> {
    return this.http.post(this.api, user);
  }
 
  loginData(data:any): Observable<any> {
    return this.http.get<any>(`${this.api}?email=${data.email}&password=${data.password}`).pipe(
      tap(user => {
        this.loggedIn = !!user.length;
      })
    );
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.get<any[]>(this.api).pipe(
      switchMap(users => {
        const user = users.find(u => u.password === oldPassword);
  
        if (user) {
          user.password = newPassword;
          return this.http.put<any>(`${this.api}/${user.id}`, user);
        } else {
          return of({ error: 'Old password is incorrect' });
        }
      }),
      catchError(error => {
        return of({ error: error.message || 'Error changing password' });
      })
    );
  }

}
