import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MeetingService } from 'src/app/service/meeting.service';
import { ShareholderInfoService } from 'src/app/service/shareholder-info.service';
import Swal from 'sweetalert2';

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
    setInterval(() => {
      this.getInfoShareholder();
    }, 30000)
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
    if (idMeeting) {
      this.meetingService.getById(idMeeting).subscribe((res: any) => {
        this.data = res;
        const status = this.data.items?.status;
  
        // Kiểm tra xem đã hiển thị thông báo cho trạng thái hiện tại hay chưa
        if (!localStorage.getItem(`status_${status}`)) {
          switch (status) {
            case 1:
              localStorage.clear();
              Swal.fire('Cuộc họp đã kết thúc!', 'Xin cảm ơn!', 'warning');
              window.location.reload();
              break;
            case 4:
              Swal.fire('Đã kết thúc biểu quyết!', 'Xin cảm ơn!', 'warning');
              this.router.navigate(['/home']);
              break;
            case 5:
              Swal.fire('Đã kết thúc bầu cử!', 'Xin cảm ơn!', 'warning');
              this.router.navigate(['/home']);
              break;
            case 6:
              Swal.fire('Đã mở lại biểu quyết!', 'Xin cảm ơn!', 'success');
              this.router.navigate(['/home/voting/' + idMeeting]);
              break;
            case 7:
              Swal.fire('Đã mở lại bầu cử!', 'Xin cảm ơn!', 'success');
              this.router.navigate(['/home/election/' + idMeeting]);
              break;
            case 3:
              Swal.fire('Đã kết thúc biểu quyết và bầu cử!', 'Xin cảm ơn!', 'success');
              this.router.navigate(['/home/result-voting/' + idMeeting]);
              break;
            default:
              console.log("ok");
              break;
          }
  
          // Đánh dấu đã hiển thị thông báo cho trạng thái hiện tại
          localStorage.setItem(`status_${status}`, 'true');
        }
      });
    } else {
      window.location.reload();
    }
  }
  


}
