import { Component, signal } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from './shared/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('angular-from-scratch');
  showNavbar = signal(true);

  constructor(private router: Router) {
    // Ocultar navbar en '/bienvenida', '/home' y bajo '/tutor'
    this.showNavbar.set(!(this.router.url.startsWith('/bienvenida') || this.router.url.startsWith('/home') || this.router.url.startsWith('/tutor')));

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects || event.url;
        // Ocultar navbar en '/bienvenida', '/home' y bajo '/tutor'
        this.showNavbar.set(!(url.startsWith('/bienvenida') || url.startsWith('/home') || url.startsWith('/tutor')));
      }
    });
  }
}
