import { Component, OnInit } from '@angular/core';
import { MeetingService } from 'src/app/service/meeting.service';
import { ShareholderInfoService } from 'src/app/service/shareholder-info.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  constructor(private shareholderService:ShareholderInfoService,private meetingService:MeetingService){}
  // _token: any;
  // constructor(){
  //   this._token = localStorage.getItem('exp');

  // }
  ngOnInit(): void {
    this.getInfoShareholder();
    // this.checkToken();
  }
  // get token(): string {
  //   return this._token;
  // }

  // set token(value: string) {
  //   this._token = value;
  //   localStorage.setItem('authToken', value);
  // }

  // public checkToken(): void {
  //   if (!this.token) {
  //     location.reload();
  //   }
  // }

  // public clearToken(): void {
  //   this._token = null;
  //   localStorage.removeItem('authToken');
  //   location.reload();
  // }
  // idMeeting!:number
  data: any = [];
  
  dataShareholder: any = [];
  getInfoShareholder() {
    const id = localStorage.getItem('id') || '';
      this.shareholderService.getById(id).subscribe((res: any) => {
        if(res){
          this.dataShareholder = res;
          const idMeeting = this.dataShareholder.items.idMeeting
          this.getInfoMeeting(idMeeting)
        }else{
          window.location.reload();
        }
       
      });
  }
  getInfoMeeting(idMeeting:number) {
    this.meetingService.getById(idMeeting).subscribe((res: any) => {
      if(res){
        this.data = res;
      }else{
        window.location.reload();
      }
     
    });
}

}
