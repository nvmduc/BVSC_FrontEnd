import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResultVoting } from 'src/app/models/result-voting';
import { ResultVotingService } from 'src/app/service/result-voting.service';
import { VotingService } from 'src/app/service/voting.service';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css']
})
export class VotingComponent implements OnInit {
  infoVoting: FormGroup = new FormGroup({});
  getRole!:any
  constructor(private result_VotingService: ResultVotingService, private votingService: VotingService, private toastr: ToastrService, private route: ActivatedRoute, private fb: FormBuilder) { }
  ngOnInit(): void {
    this.getAllByMeeting();
    this.getResultByIdShareholder();
    this.getRole = localStorage.getItem('roles');
  }

  list: any[] = [];
  toList: any[] = [];
  getAllByMeeting() {
    const idMeeting = this.route.snapshot.params['idMeeting'];
    this.votingService.getByIdMeeting(idMeeting).subscribe((res) => {
      if (res) {
        this.list = [res];
        this.toList = Object.values(this.list[0].items);
      } else {

        window.location.reload();
      }
    })
  }
  dataList: any = []
  toDataList: any = []
  getResultByIdShareholder() {
    const idShareholder = localStorage.getItem('id');
    if (idShareholder) {
      this.result_VotingService.getByIdShareholer(idShareholder).subscribe((res) => {
        if (res) {
          this.dataList = [res];
          this.toDataList = Object.values(this.dataList[0].items);
        } else {

          window.location.reload();
        }
      })
    }
  }

  valueIdVoting!: string
  valueStatus!: number

  arr: any[] = [];

  getIdVoting(idVoting: string, status: number) {
    const existingIndex = this.arr.findIndex(item => item.idVoting === idVoting);
    if (existingIndex !== -1) {
      this.arr[existingIndex].status = status;
    } else {
      const formValue = {
        idVoting: idVoting,
        idShareholder: localStorage.getItem('id'),
        status: status,
      };
      this.arr.push(formValue);
    }


    this.valueIdVoting = idVoting;
    this.valueStatus = status;
  }
  dataResultVoting: any = []
  getRV: any[] = [];
  onSubmit() {
    this.result_VotingService.getAll().subscribe((res) => {
      this.dataResultVoting = [res];
      this.getRV = this.dataResultVoting[0].items;
      const isExisting = this.getRV.some(item => item.idShareholder === localStorage.getItem('id'));
      if (!isExisting) {
        const formValues = [];
        for (let i = 0; i < this.arr.length; i++) {
          const formValue = {
            idVoting: this.arr[i].idVoting,
            idShareholder: this.arr[i].idShareholder,
            status: this.arr[i].status
          };
          formValues.push(formValue);
        }
        this.result_VotingService.create(formValues).subscribe((res) => {
          if (res) {
            this.toastr.success("Biểu quyết thành công", "Thành công")
            // this.getAllByMeeting()
          } else {
            this.toastr.error("Biểu quyết không thành công", "Thất bại")
          }
        })
      } else {
        this.toastr.warning("Kết quả của bạn đã được ghi nhận rồi", "Thất bại")
      }
    })

  }
  hasSelectedOption(): boolean {
    return this.arr.length >= this.toList.length;
  }
}
