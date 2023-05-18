import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor() {
    // this.checkExpireTime();

  }
  
  ngOnInit(): void {
    this.checkExpireTime();
  }
  private tokenExpirationTimer: any;

  checkExpireTime() {
    // const expirationTime = localStorage.getItem('exp');
    // if (expirationTime) {
    //   const now = new Date().getTime();
    //   const expireTimestamp = parseInt(expirationTime);
    //   let timeLeft = expireTimestamp - now;
    //   // let expiresIn = new Date(expirationTime).getTime() - new Date().getTime();
    //   // Nếu token hết hạn, clear localStorage và hủy timer
    //   if (timeLeft <= 0) {
    //     localStorage.clear();
    //     setTimeout(() => window.location.reload(), 1000);
    //     clearTimeout(this.tokenExpirationTimer);
    //     // Nếu token chưa hết hạn, set timer để clear localStorage
    //   } else {
    //     this.tokenExpirationTimer = setTimeout(() => {
    //       localStorage.clear();

    //     }, timeLeft);
    //     // Kiểm tra thời gian còn lại mỗi giây
    //     interval(1000).subscribe(() => {
    //       timeLeft -= 1000;
    //     });
    //   }
    // }

  }
  title = 'BVSC-Meeting';
}
