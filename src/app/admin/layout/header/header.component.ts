import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MeetingService } from 'src/app/service/meeting.service';
import { ShareholderInfoService } from 'src/app/service/shareholder-info.service';
import { from, forkJoin } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AuthAdminService } from 'src/app/service/auth-admin.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  username;
  role;
  infoMeeting: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private meetingService: MeetingService,
    private toastr: ToastrService, private shareholderService: ShareholderInfoService, private accountPreside: AuthAdminService) {
    this.username = localStorage.getItem('username');
    this.role = Number(localStorage.getItem('role'));
  }
  ngOnInit(): void {
    this.getInfoMeetingById();
  }
  dataMeeting: any = []
  getInfoMeetingById() {
    const idMeeting = this.route.snapshot.params['id'];
    this.meetingService.getById(idMeeting).subscribe((res) => {
      this.dataMeeting = res;
      this.infoMeeting = this.fb.group({
        id: this.dataMeeting.items?.id,
        idCompany: this.dataMeeting.items?.idCompany,
        nameMeeting: this.dataMeeting.items?.nameMeeting,
        numberOrganized: this.dataMeeting.items?.numberOrganized,
        yearOrganized: this.dataMeeting.items?.yearOrganized,
        status: this.dataMeeting.items?.status,
        imageBanner: this.dataMeeting.items?.imageBanner,
        startTime: this.dataMeeting.items?.startTime,
        endTime: this.dataMeeting.items?.endTime,
        address: this.dataMeeting.items?.address,
      });
    })
  }
  Logout() {
    localStorage.clear();
    this.router.navigate(['/admin/login'])
    // window.location.reload()
  }

  dataForm = this.fb.group({
    username: [""],
    password: [""],
    role: [1]
  })
  get g() {
    return this.dataForm.controls
  }
  list:any = []
  toList:any = []
  onSubmit() {
    const password = this.dataForm.value.password;
    if (password) {
      const valueMd5 = CryptoJS.MD5(password).toString();
      this.dataForm.value.password = valueMd5;
      this.dataForm.value.role = 1;
      this.accountPreside.getAll().subscribe((res)=>{
        this.list = res;
        this.toList = this.list.items
        const usernameExists = this.toList.some((item: { username: string}) => item.username === this.dataForm.value.username);
        if(!usernameExists){
          this.accountPreside.CreatePreside(this.dataForm.value).subscribe((res) => {
            if (res) {
              this.toastr.success("Đăng ký thành công tài khoản chủ tọa", "Thành công");
            } else {
              this.toastr.error("Đăng ký không thành công tài khoản chủ tọa", "Thất bại");
            }
          })
        }else{
          this.toastr.warning("Tài khoản đã tồn tại", "Cảnh báo");
        }
      })
      
    }
  }

  dataShareholder: any = [];
  onContinue(event: Event) {
    event.preventDefault();
    const idMeeting = this.route.snapshot.params['id'];
    this.shareholderService.getByIdMeeting(idMeeting).pipe(
      mergeMap((resS) => {
        this.dataShareholder = resS;
        this.infoMeeting.value.status = 3;
        return from(this.meetingService.update(idMeeting, this.infoMeeting.value));
      })
    ).subscribe(
      (resM) => {
        if (resM) {
          if (this.infoMeeting.value.status === 3) {
            this.toastr.success("Mở lại cuộc họp thành công", "Thành công");
            window.location.reload();
            this.router.navigate(['/admin/shareholder/' + idMeeting])
          }
          else {
            this.toastr.error("Không thể mở lại cuộc họp", "Thất bại");
          }
        } else {
          this.toastr.error("Không thể mở lại cuộc họp", "Thất bại");
        }
      }
    );
  }

  onStart(event: Event) {
    event.preventDefault();
    const idMeeting = this.route.snapshot.params['id'];
    let countNumberSharesCheckin = 0;
    let countAllNumberShares = 0;

    this.shareholderService.getByIdMeeting(idMeeting).pipe(
      mergeMap((resS) => {
        this.dataShareholder = resS;
        for (let item of this.dataShareholder.items) {
          countAllNumberShares += item.numberShares + item.numberSharesAuth;
          if (item.status == 1) {
            countNumberSharesCheckin += item.numberShares + item.numberSharesAuth;
          }
        }
        if (countNumberSharesCheckin > countAllNumberShares / 2) {
          this.infoMeeting.value.status = 2;
        }
        return from(this.meetingService.update(idMeeting, this.infoMeeting.value));
      })
    ).subscribe(
      (resM) => {
        if (resM) {
          if (this.infoMeeting.value.status === 2) {
            this.toastr.success("Đã bắt đầu cuộc họp", "Thành công");
            window.location.reload();
            this.router.navigate(['/admin/shareholder/' + idMeeting])
          } else {
            this.toastr.warning("Không thể bắt đầu khi tổng số cổ phần cổ đông có mặt nhỏ hơn 50%", "Thất bại");
          }
        } else {
          this.toastr.error("Không thể bắt đầu", "Thất bại");
        }
      }
    );
  }


  onEnd() {
    const idMeeting = this.route.snapshot.params['id'];
    this.infoMeeting.value.status = 1;
    this.meetingService.update(idMeeting, this.infoMeeting.value).subscribe((res) => {
      if (res) {
        this.toastr.success("Đã kết thúc cuộc họp", "Thành công");
        window.location.reload();
        this.router.navigate(['/admin/shareholder/' + idMeeting])
      } else {
        this.toastr.error("Không thể kết thúc cuộc họp", "Thành công")

      }
    })
  }
  onEndVotingAndElection() {
    const idMeeting = this.route.snapshot.params['id'];
    this.infoMeeting.value.status = 4;
    this.meetingService.update(idMeeting, this.infoMeeting.value).subscribe((res) => {
      if (res) {
        this.toastr.success("Đã kết thúc biểu quyết và bầu cử", "Thành công")
        window.location.reload();
        this.router.navigate(['/admin/shareholder/' + idMeeting])
      }
    })
  }
}
