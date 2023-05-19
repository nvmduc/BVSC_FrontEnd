import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ElectionService } from 'src/app/service/election.service';

@Component({
  selector: 'app-elention',
  templateUrl: './election.component.html',
  styleUrls: ['./election.component.css']
})
export class ElectionComponent implements OnInit{
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  constructor(private electionService: ElectionService, private toastr: ToastrService, private route: ActivatedRoute, private fb: FormBuilder){}

  numberToSubtract: number = 10000;
  input1: number = 0;
  input2: number = 0;
  input3: number = 0;
  input4: number = 0;
  result: number = this.numberToSubtract;

  subtract(){
    this.result = [this.input1, this.input2,this.input3,this.input4].reduce((accumulator, currentValue) => accumulator - currentValue, this.numberToSubtract);
  }
  
  divide() {
    this.input1 = this.numberToSubtract/4;
    this.input2 = this.numberToSubtract/4;
    this.input3 = this.numberToSubtract/4;
    this.input4 = this.numberToSubtract/4;
    this.subtract();
  }

  list:any[] = [];
  toList:any[] = [];
  getAllByMeeting() {
    const idMeeting = this.route.snapshot.params['idMeeting'];
    this.electionService.getByIdMeeting(idMeeting).subscribe((res) => {
      this.list = [res];
      this.toList = Object.values(this.list[0].items);
      console.log(this.toList)
    })
  }
}
