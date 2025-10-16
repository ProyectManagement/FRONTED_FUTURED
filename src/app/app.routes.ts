import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AlumnosComponent } from './pages/tutor/alumnos/alumnos.component';
import { AsesoriasComponent } from './pages/tutor/asesorias/asesorias.component';
import { CalendarioComponent } from './pages/tutor/calendario/calendario.component';
import { ChatbotComponent } from './pages/tutor/chatbot/chatbot.component';
import { ReportesComponent } from './pages/tutor/reportes/reportes.component';
import { TutorComponent } from './pages/tutor/tutor.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  
  // Ruta protegida para tutor
  { 
    path: 'tutor', 
    component: TutorComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: '67d769c4127234da43055a63' },
    children: [
      { path: 'alumnos', component: AlumnosComponent },
      { path: 'asesorias', component: AsesoriasComponent },
      { path: 'calendario', component: CalendarioComponent },
      { path: 'chatbot', component: ChatbotComponent },
      { path: 'reportes', component: ReportesComponent },
      { path: '', redirectTo: 'alumnos', pathMatch: 'full' }
    ]
  },

  // Redirecciones
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];