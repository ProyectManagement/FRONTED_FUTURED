import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // Base URL de tu backend Laravel
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

 
  // Obtener todos los alumnos sin filtrar (para buscador en tiempo real)
  getTodosAlumnos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/alumnos-todos`);
  }

  // Obtener la predicción de un alumno por matrícula
  getPrediccion(matricula: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/prediccion/${matricula}`);
  }
}
