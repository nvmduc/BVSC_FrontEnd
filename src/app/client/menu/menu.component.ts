import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FeedbackService } from 'src/app/service/feedback.service';
import { MeetingService } from 'src/app/service/meeting.service';
import { ShareholderInfoService } from 'src/app/service/shareholder-info.service';
import { VotingService } from 'src/app/service/voting.service';
import { InfoShareholderComponent } from '../info-shareholder/info-shareholder.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit{
  constructor(private toastr:ToastrService,private feedbackService:FeedbackService,private fb:FormBuilder,private meetingService:MeetingService, private shareholderService:ShareholderInfoService,private route: ActivatedRoute,private votingService:VotingService){}
  ngOnInit(): void {
    this.getInfoShareholder();

  }

  data: any;
  dataMeeting:any;

  list:any[] = [];
  toList:any[] = [];

  idMeeting :any

  getAllByMeeting(idMeeting:number) {
    this.votingService.getByIdMeeting(idMeeting).subscribe((res) => {
      this.list = [res];
      this.toList = Object.values(this.list[0].items);
    })
  }
  
  getInfoShareholder() {
    const id = localStorage.getItem('id');
    let idMeetingTemp: any; // Biến tạm để lưu giá trị idMeeting
    if (id != null) {
      this.shareholderService.getById(id).subscribe((res: any) => {
        this.data = res;
        idMeetingTemp = this.data.items?.idMeeting

        this.getMeetingById(idMeetingTemp);
        this.getAllByMeeting(idMeetingTemp);

      });
    } else {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }
  toDataMeeting:any = []
  getMeetingById(idMeeting:any) {
    if (idMeeting != null) {
      this.meetingService.getById(idMeeting).subscribe((res: any) => {
        this.dataMeeting = res;
        this.toDataMeeting = this.dataMeeting.items
        console.log(this.toDataMeeting);
        
      });
    } else {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  dataFeedback = this.fb.group({
    idShareholder: [localStorage.getItem('id')],
    content: [""],
  })

  onSubmit(){
    const idShareholder = localStorage.getItem('id');
    this.dataFeedback.value.idShareholder = idShareholder
    this.feedbackService.create(this.dataFeedback.value).subscribe((res) => {
      if (res) {
        this.toastr.success("Đặt câu hỏi thành công", "Thành công")
        console.log(this.dataFeedback.value)
        // this.getAllByMeeting();
        this.dataFeedback = this.fb.group({
          idShareholder: [idShareholder],
          content: [""],
        })
      } else {
        console.log("Insert False")
        this.toastr.error("Không thành công", "Thất bại")
        // this.getAllByMeeting()
      }
    });
  }

  get g() {
    return this.dataFeedback.controls
  } 
}
