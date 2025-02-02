import { Component, inject } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../interface/user';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  authService = inject(AuthenticationService);
  private currentUser: User | null = null;
  private router:Router = inject(Router);

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    console.log(this.currentUser);
    let authenticated = this.authService.isAuthenticated();
    console.log(authenticated);

  }

  logout() {
    localStorage.clear()
    this.router.navigateByUrl("/login", {replaceUrl: true})
  }
}
