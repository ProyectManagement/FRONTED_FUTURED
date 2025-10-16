import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  correo: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  backendStatus: string = 'Probando...';

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.testBackendConnection();
  }

  testBackendConnection() {
    this.apiService.checkBackendHealth().subscribe({
      next: (response) => {
        this.backendStatus = '✅ Conectado';
        console.log('Backend conectado:', response);
      },
      error: (error) => {
        this.backendStatus = '❌ Error de conexión';
        console.error('Error conectando al backend:', error);
      }
    });
  }

  onLogin() { // ✅ Quitar el parámetro event
    this.isLoading = true;
    this.errorMessage = '';

    console.log('📧 Enviando login:', { correo: this.correo, password: this.password });

    this.authService.login(this.correo, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('✅ Login exitoso, redirigiendo...', response);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al iniciar sesión';
        console.error('❌ Error en login:', error);
      }
    });
  }

  updateCorreo(value: string) {
    this.correo = value;
  }

  updatePassword(value: string) {
    this.password = value;
  }
}