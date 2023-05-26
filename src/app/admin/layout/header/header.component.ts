import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MeetingService } from 'src/app/service/meeting.service';
import { ShareholderInfoService } from 'src/app/service/shareholder-info.service';
import { from, forkJoin } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  username;
  infoMeeting: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private meetingService: MeetingService,
    private toastr: ToastrService, private shareholderService: ShareholderInfoService) {
    this.username = localStorage.getItem('username');
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
  dataShareholder: any = []
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
            setTimeout(() => window.location.reload(), 1500);
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
        this.toastr.success("Đã bắt đầu cuộc họp", "Thành công")
        setTimeout(() => window.location.reload(), 1500);
      } else {
        this.toastr.error("Không thể bắt đầu", "Thất bại")
      }
    })
  }
}
