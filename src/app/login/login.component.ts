import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { LocationService } from '../service/location.service';
import * as CryptoJS from 'crypto-js';
import { SessionService } from '../service/session.service';

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

  constructor(private sessionService: SessionService, private authService: AuthService, private locationService: LocationService, private router: Router, private fb: FormBuilder, private toastr: ToastrService, private http: HttpClient) {

    if (this.authService.isMobile()) {
      this.deviceType = 'Mobile';
      console.log(this.deviceType);
    } else if (this.authService.isTablet()) {
      this.deviceType = 'Tablet';
      console.log(this.deviceType);
    } else if (this.authService.isDesktop()) {
      this.deviceType = 'Desktop';
      console.log(this.deviceType);
    } else {
      this.deviceType = 'Unknown';
      console.log(this.deviceType);
    };
    // this.locationService.getLocation().subscribe((position) => {
    //   if(position){
    //     this.location = position;
    //   }
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

  formSession = this.fb.group({
    sessionId: [""],
    idShareholder: [""],
    ipAddress: [""],
    deviceType: [""]
  })

  ngOnInit(): void {
    this.getIPAddress();

  }
  ipAddress = '';
  getIPAddress() {
    this.http.get("http://api.ipify.org/?format=json").subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  sessionId:any
  submitSession() {
    this.formSession.value.idShareholder = localStorage.getItem("id");
    this.formSession.value.ipAddress = this.ipAddress;
    this.formSession.value.deviceType = this.deviceType;
    console.log(this.formSession.value);
    this.sessionId = this.formSession.value.sessionId
    this.sessionService.create(this.formSession.value).subscribe((res) => {
      if(res){
        console.log("Insert session success");
        localStorage.setItem("session",this.sessionId);
      }else{
        console.log("Insert session failse");
      }
    })
  }

  submitForm() {
    const password = this.UserInfo.value.password
    if (password) {
      const valueMd5 = CryptoJS.MD5(password).toString();
      this.UserInfo.value.password = valueMd5;
      this.authService.Login(this.UserInfo.value).subscribe((res) => {
        if (res) {
          const token = localStorage.getItem('token');
          const roles = localStorage.getItem('roles');
          if (token != null && roles == '0') {
            this.submitSession();
            this.toastr.success("Đăng nhập thành công cổ đông")
            this.router.navigate(['home'])
          } else if (token != null && roles == '1') {
            this.submitSession();
            this.toastr.success("Đăng nhập thành công người đại diện")
            this.router.navigate(['home'])
          } else {
            (<HTMLInputElement>document.getElementById('loginFaild')).removeAttribute('class');
            this.toastr.error("Đăng nhập không thành công")
            this.router.navigate([''])
          }
        }
      })
    }


  }

  get f() {
    return this.UserInfo.controls;
  }
}
