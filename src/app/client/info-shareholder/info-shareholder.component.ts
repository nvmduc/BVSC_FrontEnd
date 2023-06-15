import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from 'src/app/service/session.service';
import { ShareholderInfoService } from 'src/app/service/shareholder-info.service';
import Swal from 'sweetalert2';

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
    const id = localStorage.getItem('id');
    if(id){
      this.shareholderInfo.getById(id).subscribe((res: any) => {
        if(res.status == 2){
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }{
          this.data = res;
        }
        
      });
    }
  }

  Logout() {
      localStorage.clear();
      Swal.fire(
        'Đăng xuất thành công!',
        'success'
      )
      this.router.navigate(['login'])
  }
}
