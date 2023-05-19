import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ShareholderInfoService } from 'src/app/service/shareholder-info.service';

@Component({
  selector: 'app-info-shareholder',
  templateUrl: './info-shareholder.component.html',
  styleUrls: ['./info-shareholder.component.css']
})
export class InfoShareholderComponent implements OnInit {
  constructor(private shareholderInfo: ShareholderInfoService,  private toastr: ToastrService,private router: Router) { }
  ngOnInit(): void {
    this.getInfoShareholder();
  }
  data: any = [];
  id: string = '';
  getInfoShareholder() {
    const id = localStorage.getItem('id') || '';
    console.log(id)
      this.shareholderInfo.getById(id).subscribe((res: any) => {
        if(res){
          this.data = res;
          console.log(this.data.items.fullname)
        }else{
          window.location.reload();
        }
       
      });
  }

  Logout() {
      localStorage.clear();
      this.router.navigate(['login'])
      this.toastr.success("Đăng xuất thành công","Đăng xuất")
      setTimeout(() => window.location.reload(), 1000);
  }

}
