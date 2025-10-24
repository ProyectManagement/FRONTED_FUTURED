import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';

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
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css']
})
export class AlumnosComponent implements OnInit {
  alumnos: Alumno[] = [];
  filteredAlumnos: Alumno[] = [];
  grupos: string[] = [];
  selectedGroup: string = '';
  searchQuery: string = '';

  loading = true;
  error = '';

  constructor(private ApiService: ApiService) {}

  ngOnInit(): void {
    this.cargarAlumnos();
  }

  cargarAlumnos() {
    this.loading = true;
    this.error = '';
    this.alumnos = [];

    this.ApiService.getTodosAlumnos().subscribe({
      next: (data: Alumno[]) => {
        this.alumnos = data || [];
        this.grupos = Array.from(new Set(this.alumnos.map(a => a.id_grupo).filter((g): g is string => !!g)));
        this.applyFilters();
        this.loading = false;

        if (this.alumnos.length === 0) {
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

  applyFilters() {
    const query = this.searchQuery.trim().toLowerCase();

    let list = [...this.alumnos];

    if (this.selectedGroup) {
      list = list.filter(a => (a.id_grupo || '').toLowerCase() === this.selectedGroup.toLowerCase());
    }

    if (query) {
      list = list.filter(a => {
        const fields = [
          a.matricula,
          a.nombre,
          a.apellido_paterno,
          a.apellido_materno,
          a.id_carrera,
          a.id_grupo,
          a.created_at,
        ].map(v => (v || '').toString().toLowerCase());
        return fields.some(f => f.includes(query));
      });
    }

    this.filteredAlumnos = list;
  }
}
