import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from 'src/app/service/session.service';
import { ShareholderInfoService } from 'src/app/service/shareholder-info.service';

@Component({
  selector: 'app-info-shareholder',
  templateUrl: './info-shareholder.component.html',
  styleUrls: ['./info-shareholder.component.css']
})
export class InfoShareholderComponent implements OnInit {
  constructor(private sessionService:SessionService,private shareholderInfo: ShareholderInfoService,  private toastr: ToastrService,private router: Router) { }
  ngOnInit(): void {
    this.getInfoShareholder();
  }
  data: any = [];
  getInfoShareholder() {
    const id = localStorage.getItem('id') || '';
      this.shareholderInfo.getById(id).subscribe((res: any) => {
        if(res){
          this.data = res;
        }else{
          window.location.reload();
        }
       
      });
  }

  Logout() {
      // this.sessionService.update()
      localStorage.clear();
      this.router.navigate(['login'])
      this.toastr.success("Đăng xuất thành công","Đăng xuất")
      // setTimeout(() => window.location.reload(), 1000);
  }

}
