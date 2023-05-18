import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { LocationService } from '../service/location.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  // public username: string = '';
  // public password: string = '';
  public valueMd5: string = '';
  public deviceType: string = '';
  public location: any;
  public errorMessage: string = '';

  constructor(private authService: AuthService, private locationService: LocationService, private router: Router, private fb: FormBuilder, private toastr: ToastrService, private http: HttpClient) {

    // if (this.accountService.isMobile()) {
    //   this.deviceType = 'Mobile';
    //   console.log(this.deviceType);
    // } else if (this.accountService.isTablet()) {
    //   this.deviceType = 'Tablet';
    //   console.log(this.deviceType);
    // } else if (this.accountService.isDesktop()) {
    //   this.deviceType = 'Desktop';
    //   console.log(this.deviceType);
    // } else {
    //   this.deviceType = 'Unknown';
    //   console.log(this.deviceType);
    // };
    // this.locationService.getLocation().subscribe(
    //   (position) => {
    //     this.location = position;
    //     console.log(this.location)
    //   },
    //   (error) => {
    //     this.errorMessage = error.message;
    //     console.log(this.errorMessage)
    //   }
    // );
  }

  UserInfo = this.fb.group({
    username: ["", Validators.required],
    password: ["", Validators.required],
  })

  ngOnInit(): void {
    // this.getIPAddress();

  }
  // ipAddress = '';
  // getIPAddress() {
  //   this.http.get("http://api.ipify.org/?format=json").subscribe((res: any) => {
  //     this.ipAddress = res.ip;
  //   });
  // }

  
  submitForm() {
    const password = this.UserInfo.value.password
    if (password) {
      const valueMd5 = CryptoJS.MD5(password).toString();
      this.UserInfo.value.password = valueMd5;
      console.log(valueMd5)
      this.authService.Login(this.UserInfo.value).subscribe((res) => {
        const token = localStorage.getItem('token');
        const roles = localStorage.getItem('roles');
        if (token != null && roles == '0') {
          this.toastr.success("Đăng nhập thành công cổ đông")
          this.router.navigate(['home'])
        } else if (token != null && roles == '1') {
          this.toastr.success("Đăng nhập thành công người đại diện")
          this.router.navigate(['home'])
        } else {
          (<HTMLInputElement>document.getElementById('loginFaild')).removeAttribute('class');
          this.toastr.error("Đăng nhập không thành công")
          this.router.navigate([''])
        }
      },
        (err) => {
          this.router.navigate([''])
          console.log(err)
        }
      )
    }


  }

  get f() {
    return this.UserInfo.controls;
  }
}
