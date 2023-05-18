import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  constructor(private meetingService:MeetingService, private shareholderService:ShareholderInfoService,private route: ActivatedRoute,private votingService:VotingService){}
  ngOnInit(): void {
    this.getInfoShareholder();

  }

  data: any;
  dataMeeting:any;

  list:any[] = [];
  toList:any[] = [];



  idMeeting :any

  getAllByMeeting(idMeeting:number) {
    console.log(idMeeting)
    this.votingService.getByIdMeeting(idMeeting).subscribe((res) => {
      this.list = [res];
      this.toList = Object.values(this.list[0].items);
    })
  }
  
  

  getInfoShareholder() {
    const id = localStorage.getItem('id');
    let idMeetingTemp: any; // Biến tạm để lưu giá trị idMeeting
    if (id !== null) {
      this.shareholderService.getById(id).subscribe((res: any) => {
        this.data = res;
        idMeetingTemp = this.data.items.idMeeting

        this.getMeetingById(idMeetingTemp);
        this.getAllByMeeting(idMeetingTemp);

      });
    } else {
      console.log("Không tìm thấy id")
    }
  }
  getMeetingById(idMeeting:any) {
    if (idMeeting !== null) {
      this.meetingService.getById(idMeeting).subscribe((res: any) => {
        this.dataMeeting = res;

      });
    } else {
      console.log("Không tìm thấy id")
    }
  }

}
