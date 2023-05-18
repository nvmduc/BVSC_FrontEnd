import { Component } from '@angular/core';

@Component({
  selector: 'app-elention',
  templateUrl: './election.component.html',
  styleUrls: ['./election.component.css']
})
export class ElectionComponent {
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
}
