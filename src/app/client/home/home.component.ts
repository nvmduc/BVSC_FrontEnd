import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  // _token: any;
  // constructor(){
  //   this._token = localStorage.getItem('exp');

  // }
  ngOnInit(): void {
    // this.checkToken();
  }
  // get token(): string {
  //   return this._token;
  // }

  // set token(value: string) {
  //   this._token = value;
  //   localStorage.setItem('authToken', value);
  // }

  // public checkToken(): void {
  //   if (!this.token) {
  //     location.reload();
  //   }
  // }

  // public clearToken(): void {
  //   this._token = null;
  //   localStorage.removeItem('authToken');
  //   location.reload();
  // }

}
