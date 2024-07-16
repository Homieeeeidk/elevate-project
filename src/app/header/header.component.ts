import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/auth-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy{

  private authenticationSub: Subscription;

  userAuthenticated = false;
  isloginorsignup = true;
  constructor(private authService: AuthService) {

  }
  ngOnDestroy(): void {
    this.authenticationSub.unsubscribe();
  }

  ngOnInit(): void {
    this.userAuthenticated = this.authService.getisAuthenticated();
    this.isloginorsignup = this.authService.getisisloginorsignup();
    this.authenticationSub = this.authService.getAuthenticatedSub().subscribe(status => {
      this.userAuthenticated = status;
    })
  }

  logout(){
    this.authService.logout();
  }

}
