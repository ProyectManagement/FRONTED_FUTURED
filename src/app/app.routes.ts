import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AlumnosComponent } from './pages/alumnos/alumnos.component';
import { AsesoriasComponent } from './pages/asesorias/asesorias.component';
import { CalendarioComponent } from './pages/calendario/calendario.component';
import { ChatbotComponent } from './pages/chatbot/chatbot.component';
import { ReportesComponent } from './pages/reportes/reportes.component';


export const routes: Routes = [
  { path: 'home', component: HomePageComponent },

  { path: 'alumnos', component: AlumnosComponent },
  { path: 'asesorias', component: AsesoriasComponent },
  { path: 'calendario', component: CalendarioComponent },
  { path: 'chatbot', component: ChatbotComponent },
  { path: 'reportes', component: ReportesComponent },
  {
    path: '**', redirectTo: 'home', pathMatch: 'full'
  }
];
