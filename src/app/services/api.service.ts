import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
import { environment } from '../../environments/environment'; // ✅ Importar environment

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // ✅ Usar environment para las URLs
  private laravelApiUrl = 'https://futured.shop/api'; // Mantener local por ahora
  private iaApiUrl = 'https://ia-futured.onrender.com';

  // ✅ Agregar tu backend de Render
  private nodeApiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ================================
  // 🔹 MÉTODOS DEL BACKEND NODE.JS (RENDER)
  // ================================

  /** Verificar salud del backend */
  checkBackendHealth(): Observable<any> {
    return this.http.get(`${this.nodeApiUrl}/health`);
  }

  // ================================
  // 🔹 MÉTODOS DEL BACKEND LARAVEL
  // ================================

  /** Obtener todos los alumnos */
 getTodosAlumnos(): Observable<any> {
  console.log('🔗 Conectando a:', `${this.laravelApiUrl}/alumnos-todos`);
  return this.http.get(`${this.laravelApiUrl}/alumnos-todos`).pipe(
    timeout(10000) // ✅ Timeout de 10 segundos
  );
}

  /** Obtener predicción desde Laravel */
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
