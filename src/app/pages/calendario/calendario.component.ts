import { Component, OnInit } from '@angular/core';

interface CalendarDay {
  date: string;
  day: number;
  isCurrentMonth: boolean;
}

interface EventDetail {
  fecha: string;
  tema: string;
  alumno_nombre?: string;
}

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
})
export class CalendarioComponent implements OnInit {
  currentDate: Date = new Date();
  currentMonth: string = '';
  currentYear: number = 0;
  currentMonthNum: number = 0;
  
  calendarDays: CalendarDay[] = [];
  events: string[] = [];
  eventsDetails: EventDetail[] = [];
  
  showEventDetails: boolean = false;
  selectedDateEvents: EventDetail[] = [];

  monthNames: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  dayNames: string[] = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  ngOnInit(): void {
    this.generateCalendar();
  }

  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    this.currentMonth = this.monthNames[month];
    this.currentYear = year;
    this.currentMonthNum = month + 1;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    this.calendarDays = [];

    // Días del mes anterior
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      this.calendarDays.push({
        date: `${year}-${(month).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        day: day,
        isCurrentMonth: false
      });
    }

    // Días del mes actual
    for (let day = 1; day <= lastDay.getDate(); day++) {
      this.calendarDays.push({
        date: `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        day: day,
        isCurrentMonth: true
      });
    }

    // Días del mes siguiente
    const totalCells = 42;
    const remainingDays = totalCells - this.calendarDays.length;
    
    for (let day = 1; day <= remainingDays; day++) {
      this.calendarDays.push({
        date: `${year}-${(month + 2).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        day: day,
        isCurrentMonth: false
      });
    }

    this.generateSampleEvents(month + 1, year);
  }

  generateSampleEvents(month: number, year: number): void {
    this.events = [];
    this.eventsDetails = [];

    const sampleEvents = [
      { day: 5, tema: 'Matemáticas básicas', alumno: 'Ana García' },
      { day: 12, tema: 'Física elemental', alumno: 'Carlos López' },
      { day: 15, tema: 'Química orgánica', alumno: 'María Rodríguez' },
      { day: 20, tema: 'Programación web', alumno: 'Juan Pérez' },
      { day: 25, tema: 'Inglés avanzado', alumno: 'Laura Martínez' }
    ];

    sampleEvents.forEach(event => {
      const dateStr = `${year}-${month.toString().padStart(2, '0')}-${event.day.toString().padStart(2, '0')}`;
      this.events.push(dateStr);
      this.eventsDetails.push({
        fecha: dateStr,
        tema: event.tema,
        alumno_nombre: event.alumno
      });
    });
  }

  prevMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
  }

  goToCurrentMonth(): void {
    this.currentDate = new Date();
    this.generateCalendar();
  }

  toggleDetails(date: string): void {
    this.selectedDateEvents = this.eventsDetails.filter(event => event.fecha === date);
    this.showEventDetails = this.selectedDateEvents.length > 0;
  }

  hasEvent(date: string): boolean {
    return this.events.includes(date);
  }
}