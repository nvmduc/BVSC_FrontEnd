import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VotingService } from 'src/app/service/voting.service';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css']
})
export class VotingComponent implements OnInit{
  constructor(private votingService: VotingService, private toastr: ToastrService, private route: ActivatedRoute, private fb: FormBuilder) { }
  ngOnInit(): void {
    this.getAllByMeeting();
  }

  list:any[] = [];
  toList:any[] = [];
  getAllByMeeting() {
    const idMeeting = this.route.snapshot.params['idMeeting'];
    this.votingService.getByIdMeeting(idMeeting).subscribe((res) => {
      this.list = [res];
      this.toList = Object.values(this.list[0].items);
      console.log(this.toList)
    })
  }
}
