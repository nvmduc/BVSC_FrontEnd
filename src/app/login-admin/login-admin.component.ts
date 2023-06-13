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
  constructor(private adminAuthService: AuthAdminService, private router: Router,
      private fb: FormBuilder, private toastr: ToastrService) { }
  UserInfo = this.fb.group({
    username: ["", Validators.required],
    password: ["", Validators.required],
  })
  role!:number;
  submitForm() {
    const password = this.UserInfo.value.password
    if (password) {
      const valueMd5 = CryptoJS.MD5(password).toString();
      this.UserInfo.value.password = valueMd5;
      this.adminAuthService.Login(this.UserInfo.value).subscribe((res) => {
        const token = localStorage.getItem('token');
       this.role = Number(localStorage.getItem('role'))
        if (token != null && this.role == 0) {
          this.toastr.success("Đăng nhập thành công quản trị viên")
          this.router.navigate(['/admin'])
        }else if(token != null && this.role == 1){
          this.toastr.success("Đăng nhập thành công chủ tọa")
          this.router.navigate(['/admin'])
        }else {
          (<HTMLInputElement>document.getElementById('loginFaild')).removeAttribute('class');
          this.toastr.error("Đăng nhập không thành công")
          localStorage.clear();
          this.router.navigate(['/admin/login'])
        }
      },
        (err) => {
          this.router.navigate(['/admim/login'])
        }
      )
    }


  }

  get f() {
    return this.UserInfo.controls;
  }
}
