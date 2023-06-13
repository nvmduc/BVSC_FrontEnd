import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { FeedbackService } from 'src/app/service/feedback.service';
import { ShareholderInfoService } from 'src/app/service/shareholder-info.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit{
  constructor(private shareholderService:ShareholderInfoService,private feedbackService:FeedbackService,private route:ActivatedRoute,private datePipe: DatePipe){

  }
  ngOnInit(): void {
    this.getFeedbackByMeeting();
    this.getShareholderByMeeting();

  }
  listFeedback:any = []
  toListFeedback:any = []
  list:any = []
  toList:any[] = []
  data:any = []
  toData:any[] = []
  getShareholderByMeeting() {
    const idMeeting = this.route.snapshot.params['id'];
    this.shareholderService.getByIdMeeting(idMeeting).subscribe((res) => {
        this.list = [res];
        this.toList = Object.values(this.list[0].items);
    })
  }

  getShareholderById(id:string){
    this.shareholderService.getById(id).subscribe((shareholder)=>{
      this.data = [shareholder];
      console.log(this.data);
      
    })
  }

  fullname!:string
  feedbackListWithName: any[] = [];
  getFeedbackByMeeting(){
    const idMeeting = this.route.snapshot.params['id']
    this.feedbackService.getByIdMeeting(idMeeting).subscribe((res) => {
      this.listFeedback = res;
      this.toListFeedback = Object.values(this.listFeedback.items);
    
      this.toListFeedback.forEach((feedback:any) => {
        const idShareholder = feedback.idShareholder;
        this.shareholderService.getById(idShareholder).subscribe((shareholder) => {
          this.data = shareholder
          const feedbackWithName = {
            idShareholder: idShareholder,
            name: this.data.items?.fullname,
            content: feedback.content,
            timeFeedback: feedback.timeFeedback
          };
          this.feedbackListWithName.push(feedbackWithName);
        });
      });
    });
    
  }
}
