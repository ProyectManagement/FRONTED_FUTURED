export interface User {
  id: string;
  nombre: string;
  app: string;
  apm: string;
  correo: string;
  id_rol: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}