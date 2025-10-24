import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, AuthResponse } from '../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // ✅ Temporalmente para pruebas
  private apiUrl = 'https://backend-rvgp.onrender.com/api';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private roles = {
    ADMIN: '67d769c4127234da43055a62',
    TUTOR: '67d769c4127234da43055a63'
  };

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadToken();
  }

  private loadToken() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(correo: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, {
      correo,
      contraseña: password
    }).pipe(
      tap(response => {
        if (response.success) {
          this.setSession(response);
          this.redirectBasedOnRole(response.user.id_rol);
        }
      })
    );
  }

  private setSession(authResult: AuthResponse) {
    localStorage.setItem('token', authResult.token);
    localStorage.setItem('user', JSON.stringify(authResult.user));
    this.currentUserSubject.next(authResult.user);
  }

  private redirectBasedOnRole(id_rol: string) {
    console.log('🔍 Rol detectado:', id_rol);

    if (id_rol === this.roles.ADMIN) {
      console.log('👨‍💼 Admin detectado, redirigiendo...');
      this.router.navigate(['/admin']);
    } else if (id_rol === this.roles.TUTOR) {
      console.log('👨‍🏫 Tutor detectado, redirigiendo a tutor/alumnos...');
      this.router.navigate(['/tutor/alumnos']);
    } else {
      console.log('❌ Rol no reconocido, redirigiendo a home');
      this.router.navigate(['/home']);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/bienvenida']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    const user = this.currentUserSubject.value;
    return user ? user.id_rol : null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === this.roles.ADMIN;
  }

  isTutor(): boolean {
    return this.getUserRole() === this.roles.TUTOR;
  }
}
