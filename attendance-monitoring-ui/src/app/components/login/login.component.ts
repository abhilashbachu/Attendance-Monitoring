import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  emailId: string;
  password: string;
  constructor( private router: Router ) { }

  ngOnInit() {
  }

  login() {
    console.log(this.emailId, this.password);
    this.router.navigate(['/layout']);
  }

}
