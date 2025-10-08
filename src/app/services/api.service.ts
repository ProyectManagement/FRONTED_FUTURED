import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // 🌐 Laravel API (para alumnos, reportes, usuarios, etc.)
  private laravelApiUrl = 'http://127.0.0.1:8000/api';
  // Si ya la tienes desplegada en Render:
  // private laravelApiUrl = 'https://futured-api.onrender.com/api';

  // 🤖 API de IA (FastAPI)
  private iaApiUrl = 'https://ia-futured.onrender.com';

  constructor(private http: HttpClient) {}

  // ================================
  // 🔹 MÉTODOS DEL BACKEND LARAVEL
  // ================================

  /** Obtener todos los alumnos */
  getTodosAlumnos(): Observable<any> {
    return this.http.get(`${this.laravelApiUrl}/alumnos-todos`);
  }

  /** Obtener predicción desde Laravel (si existe este endpoint) */
  getPrediccionDesdeLaravel(matricula: string): Observable<any> {
    return this.http.get(`${this.laravelApiUrl}/prediccion/${matricula}`);
  }

  // ================================
  // 🔹 MÉTODOS DE LA API DE IA (FASTAPI)
  // ================================

  /** Obtener predicción desde la IA por matrícula */
  getPrediccionDesdeIA(matricula: string): Observable<any> {
    const body = { matricula };
    return this.http.post(`${this.iaApiUrl}/predict/by_matricula`, body);
  }
}
