import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/auth-service';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {


  constructor(private authService: AuthService){}
    
  ngOnInit(): void {

    this.authService.authenticateFromLocalStorage();

  }
  
  title = 'E L E V A T E';
}
