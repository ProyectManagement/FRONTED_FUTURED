import { Component, OnInit } from '@angular/core';

interface Reporte {
  _id: string;
  titulo: string;
  descripcion: string;
  created_at: string;
  compartido: boolean;
}

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
})
export class ReportesComponent implements OnInit {
  reportes: Reporte[] = [];
  hayReportes: boolean = false;

  ngOnInit(): void {
    this.cargarReportes();
  }

  cargarReportes(): void {
    this.reportes = [
      {
        _id: '1',
        titulo: 'Reporte de Asesorías - Enero 2024',
        descripcion: 'Reporte mensual de todas las asesorías realizadas durante el mes de enero',
        created_at: '2024-01-31 15:30:00',
        compartido: true
      },
      {
        _id: '2',
        titulo: 'Evaluación de Alumnos - Primer Semestre',
        descripcion: 'Resultados de evaluación del primer semestre académico',
        created_at: '2024-02-15 10:15:00',
        compartido: true
      }
    ];

    this.hayReportes = this.reportes.length > 0;
  }

  descargarReporte(reporteId: string): void {
    console.log('Descargando reporte:', reporteId);
    // Lógica para descargar el reporte
  }
}