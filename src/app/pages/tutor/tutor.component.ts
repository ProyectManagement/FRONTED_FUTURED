import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-tutor',
  templateUrl: './tutor.component.html',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  styleUrls: ['./tutor.component.css']
})
export class TutorComponent implements OnInit {
  currentUser: any;

  // Ruta de imagen personalizable; si no existe, se usa icono.
  profileImageUrl: string = '/img/profile.jpg'; // Ajustable por ti
  showAvatarImage: boolean = true;
  menuOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  goToProfile() {
    this.router.navigate(['/tutor/perfil']);
    this.menuOpen = false;
  }

  logout() {
    this.authService.logout();
  }
}