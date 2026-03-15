import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class Navbar {
  isLoggedIn = true;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ){
    this.updateAuthState();
    this.router.events
    .pipe(filter(e => e instanceof NavigationEnd))
    .subscribe(() => this.updateAuthState());
  }

  updateAuthState(){
    this.isLoggedIn = !!this.authService.getToken();
  }

  logout(){
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }
}
