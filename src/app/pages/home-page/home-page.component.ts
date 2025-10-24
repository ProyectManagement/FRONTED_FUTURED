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

  // URLs configurables: puedes dejarlas vacías
  logoUrl: string = 'src/app/assets/img/cuervo.png';
  backgroundUrl: string = 'src/app/assets/img/docencia.jpg';

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.testBackendConnection();
  }

  /**
   * Normaliza rutas como 'src/app/img/foo.png' -> '/img/foo.png'
   * para que funcionen con los assets servidos por Angular.
   */
  assetUrl(path: string | null | undefined): string {
    if (!path) return '';
    // Si comienza con 'src/app/', reemplaza por raíz '/'
    if (path.startsWith('src/app/')) {
      return '/' + path.replace('src/app/', '');
    }
    return path;
  }

  /**
   * Devuelve el valor para el binding de estilo background-image,
   * con comillas para soportar espacios en el nombre del archivo.
   */
  backgroundImage(): string | null {
    const url = this.assetUrl(this.backgroundUrl);
    return url ? `url("${url}")` : null;
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

  updateCorreo(value: string) { this.correo = value; }
  updatePassword(value: string) { this.password = value; }
  onLogin() {
    this.isLoading = true;
    this.authService.login(this.correo, this.password).subscribe({
      next: () => { this.isLoading = false; },
      error: (err) => { this.errorMessage = 'Error de autenticación'; this.isLoading = false; }
    });
  }
}