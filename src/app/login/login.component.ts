import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { LocationService } from '../service/location.service';
import * as CryptoJS from 'crypto-js';
import { SessionService } from '../service/session.service';
import { ShareholderInfoService } from '../service/shareholder-info.service';
import { MeetingService } from '../service/meeting.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  public valueMd5: string = '';
  public deviceType: string = '';
  public location: any;
  public errorMessage: string = '';

  constructor(private meetingService: MeetingService, private shareholderService: ShareholderInfoService, private sessionService: SessionService, private authService: AuthService, private locationService: LocationService, private router: Router, private fb: FormBuilder, private toastr: ToastrService, private http: HttpClient) {

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

  sessionId: any
  dataSession: any = []
  submitSession() {
    this.formSession.value.idShareholder = localStorage.getItem("id");
    this.formSession.value.ipAddress = this.ipAddress;
    this.formSession.value.deviceType = this.deviceType;
    this.sessionService.create(this.formSession.value).subscribe((res) => {
      this.dataSession = res;
    })
  }
  status!: number
  dataShareholder: any = [];
  dataMeeting: any = [];
  submitForm() {
    const password = this.UserInfo.value.password
    if (password) {
      const valueMd5 = CryptoJS.MD5(password).toString();
      this.UserInfo.value.password = valueMd5;
      this.authService.Login(this.UserInfo.value).subscribe((res) => {
        if (res) {
          const idShareholder = localStorage.getItem("id")
          if (idShareholder) {
            this.shareholderService.getById(idShareholder).subscribe((resS) => {
              this.dataShareholder = resS;
              if (!this.dataShareholder.items?.idMeeting) {
                Swal.fire(
                  'Thông tin tài khoản không chính xác!',
                  'Xin cảm ơn!',
                  'error'
                )
              } else {
                this.meetingService.getById(this.dataShareholder.items?.idMeeting).subscribe((resM) => {
                  this.dataMeeting = resM;
                  if (this.dataMeeting) {
                    if (this.dataMeeting.items?.status == 2 || this.dataMeeting.items?.status == 3 || this.dataMeeting.items?.status == 4|| this.dataMeeting.items?.status == 5|| this.dataMeeting.items?.status == 6|| this.dataMeeting.items?.status == 7) {
                      const token = localStorage.getItem('token');
                      const roles = localStorage.getItem('roles');
                      if (token != null && roles == '0') {
                        this.submitSession();
                        Swal.fire(
                          'Đăng nhập thành công!',
                          'Xin cảm ơn!',
                          'success'
                        )
                        this.router.navigate(['home'])
                      } else if (token != null && roles == '1') {
                        this.submitSession();
                        this.toastr.success("Đăng nhập thành công đoàn chủ tịch")
                        this.router.navigate(['home'])
                      } else {
                        (<HTMLInputElement>document.getElementById('loginFaild')).removeAttribute('class');
                        Swal.fire(
                          'Đăng nhập không thành công!',
                          'Xin cảm ơn!',
                          'error'
                        )
                        this.router.navigate([''])
                      }
                    } else if (this.dataMeeting.items?.status == 0) {
                      Swal.fire(
                        'Cuộc họp chưa bắt đầu!',
                        'Xin cảm ơn!',
                        'warning'
                      )
                    } else {
                      Swal.fire(
                        'Cuộc họp đã kết thúc!',
                        'Xin cảm ơn!',
                        'error'
                      )
                    }
                  } else {
                    Swal.fire(
                      'Thông tin tài khoản không chính xác!',
                      'Xin cảm ơn!',
                      'error'
                    )
                  }
                })
              }
            })
          }
        } else {
          Swal.fire(
            'Thông tin tài khoản không chính xác!',
            'Xin cảm ơn!',
            'error'
          )
        }
      })
    }
  }

  get f() {
    return this.UserInfo.controls;
  }

}
