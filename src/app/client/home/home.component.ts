import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MeetingService } from 'src/app/service/meeting.service';
import { ShareholderInfoService } from 'src/app/service/shareholder-info.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private shareholderService: ShareholderInfoService, private router: Router, private meetingService: MeetingService, private toastr: ToastrService) {
    
   }
  // _token: any;
  // constructor(){
  //   this._token = localStorage.getItem('exp');

  // }
  private tokenExpired() {
    const exp = localStorage.getItem('exp');
    if (!exp) {
      return true; // Nếu không có token, coi như đã hết hạn
    }
    const expiry = parseInt(exp);
    return Math.floor(Date.now()) >= expiry;
  }
  ngOnInit(): void {
    this.getInfoShareholder();
    setInterval(() => {
      if (this.tokenExpired()) {
          localStorage.clear()
          this.router.navigate([''])
          this.toastr.error("Tài khoản của bạn đã đăng nhập quá 120 phút vui lòng đăng nhập lại")
        } else {
          console.log("ok");
        }
      }, 60000);
  }

  data: any = [];

  dataShareholder: any = [];
  getInfoShareholder() {
    const id = localStorage.getItem('id');
    if (id) {
      this.shareholderService.getById(id).subscribe((res: any) => {
        if (res) {
          this.dataShareholder = res;
          const idMeeting = this.dataShareholder.items.idMeeting
          this.getInfoMeeting(idMeeting)
        } else {
          window.location.reload();
        }

      });
    }
  }
  getInfoMeeting(idMeeting: number) {
    this.meetingService.getById(idMeeting).subscribe((res: any) => {
        this.data = res;
    });
  }

}
