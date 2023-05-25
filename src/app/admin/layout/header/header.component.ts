import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  username;
  constructor( private router:Router) { 
    this.username = localStorage.getItem('username');
  }
  ngOnInit(): void {
  }
  Logout(){
    localStorage.clear();
    this.router.navigate(['/admin/login'])
    // window.location.reload()
  }
}
