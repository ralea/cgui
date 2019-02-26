import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  private authListenerSubs = new Subscription();
  public userIsAuthenticated = false;
  constructor(private authService: AuthService) {}
  title = 'cgui';

  ngOnInit() {
    this.authListenerSubs = this.authService.getAuthStatusListner().subscribe(
      isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      }
    ) ;
    this.authService.autoAuthUser();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
