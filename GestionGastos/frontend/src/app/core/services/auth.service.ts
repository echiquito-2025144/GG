import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthResponse {
  token: string;
  usuario: {
    id: number;
    nombre: string;
    email: string;
    rol: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/auth';

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {
        // Guarda el JWT y los datos del usuario en el navegador
        if (res.token) {
          localStorage.setItem('token', res.token);
        }
        if (res.usuario) {
          localStorage.setItem('usuario', JSON.stringify(res.usuario));
        }
      })
    );
  }

  registro(nombre: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { nombre, email, password }).pipe(
      tap((res) => {
        // Guarda el JWT y los datos del usuario al registrarse
        if (res.token) {
          localStorage.setItem('token', res.token);
        }
        if (res.usuario) {
          localStorage.setItem('usuario', JSON.stringify(res.usuario));
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  obtenerUsuario() {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  }
}