import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { HttpClientModule } from '@angular/common/http';

interface Alumno {
  _id?: string;
  matricula?: string;
  nombre?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  id_carrera?: string;
  id_grupo?: string;
  created_at?: string;
}

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './alumnos.component.html',
})
export class AlumnosComponent implements OnInit {
  alumnos: Alumno[] = [];
  loading = true;
  error = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarAlumnos();
  }

  cargarAlumnos() {
    this.loading = true;
    this.error = '';
    this.alumnos = [];

    this.apiService.getTodosAlumnos().subscribe({
      next: (data: Alumno[]) => {
        this.alumnos = data;
        this.loading = false;

        if (data.length === 0) {
          this.error = '⚠️ No hay alumnos disponibles.';
        }
      },
      error: (err) => {
        console.error('Error al cargar alumnos:', err);
        this.error = '❌ Error al cargar los alumnos';
        this.loading = false;
      },
    });
  }
}
