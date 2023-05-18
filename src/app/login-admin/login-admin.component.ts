import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthAdminService } from '../service/auth-admin.service';
import { LocationService } from '../service/location.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent {
  constructor(private adminAuthService: AuthAdminService, private locationService: LocationService, private router: Router, private fb: FormBuilder, private toastr: ToastrService, private http: HttpClient) {
  } 
    UserInfo = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    })

    submitForm() {
      const password = this.UserInfo.value.password
      if (password) {
        const valueMd5 = CryptoJS.MD5(password).toString();
        this.UserInfo.value.password = valueMd5;
        console.log(valueMd5)
        this.adminAuthService.Login(this.UserInfo.value).subscribe((res) => {
          const token = localStorage.getItem('token');
          // const roles = localStorage.getItem('roles');
          if (token != null && token != "undefined") {
            this.toastr.success("Đăng nhập thành công quản trị viên")
            this.router.navigate(['admin'])
          } else {
            (<HTMLInputElement>document.getElementById('loginFaild')).removeAttribute('class');
            this.toastr.error("Đăng nhập không thành công")
            localStorage.clear();
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
