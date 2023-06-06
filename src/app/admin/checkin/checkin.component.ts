import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShareholderInfoService } from 'src/app/service/shareholder-info.service';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})
export class CheckinComponent implements OnInit{
  password: any;
  currentDate!: number;

  constructor(private route:ActivatedRoute,private shareholderService:ShareholderInfoService){
  }
  ngOnInit(): void {
    this.currentDate = Date.now();
    this.getCheckin();
    window.addEventListener('afterprint', this.handleAfterPrint);
  }
  dataShareholder:any = []
  getCheckin(){
    let idShareholder = this.route.snapshot.params['idS'];
    this.password = localStorage.getItem('password')
    this.shareholderService.getById(idShareholder).subscribe((res)=>{
      this.dataShareholder = res;
      setTimeout(()=>{
        window.print();
      },500)
    })
  }
  handleAfterPrint(): void {
    // Thực hiện hành động sau khi in xong
    console.log('In hoàn tất');
    window.history.back(); // Quay về trang trước đó
  }

  print(): void {
    window.print();
  }
}
