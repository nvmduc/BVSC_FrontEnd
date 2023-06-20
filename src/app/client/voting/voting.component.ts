import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResultVoting } from 'src/app/models/result-voting';
import { ResultVotingService } from 'src/app/service/result-voting.service';
import { VotingService } from 'src/app/service/voting.service';
import Swal from 'sweetalert2';

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
    const existingIndex = this.arr.findIndex(item => item.idVoting === idVoting && item.status == 0);    
    if (existingIndex != -1) {
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
    const idMeeting = this.route.snapshot.params['idMeeting'];
    this.result_VotingService.getByIdMeeting(idMeeting).subscribe(async (res) => {
      this.dataResultVoting = res;
      this.getRV = this.dataResultVoting.items;
      const isExistingArr = this.arr.map(item => item.idVoting);
      console.log(isExistingArr);
      console.log(this.arr);
      
      let isNew = true;
      for (let itemC of isExistingArr) {
        const isExisting = this.getRV.filter(item => item.idShareholder === localStorage.getItem('id') && item.idVoting == itemC);

        if (isExisting.length != 0) {
          isNew = false;
          break;
        }
      }
      // const isExisting = this.getRV.some(item => item.idShareholder === localStorage.getItem('id'));      
      if (isNew) {
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
            Swal.fire(
              'Biểu quyết thành công!',
              'Xin cảm ơn!',
              'success'
            )
          } else {
            Swal.fire(
              'Biểu quyết thất bại!',
              'Xin cảm ơn!',
              'success'
            )
          }
        })
      } else {
        const ids = [];
        for (let itemC of isExistingArr) {
          const isExisting = this.getRV.filter(item => item.idShareholder === localStorage.getItem('id') && item.idVoting == itemC);
          const isExistingIds = isExisting.map(item => item.id);
          ids.push(isExistingIds[0]);
        }
        const formValues = [];
        for (let i = 0; i < this.arr.length; i++) {
          const formValue = {
            id: ids[i],
            status: this.arr[i].status
          };
          formValues.push(formValue);
        }
        console.log(ids);
        console.log(formValues);
        
        for (let id of ids) {
          this.result_VotingService.update(id, formValues).subscribe();
        }
        const results = await Promise.all(formValues);
        const isSuccess = results.every((res) => res);

        if (isSuccess) {
          Swal.fire(
            'Cập nhật biểu quyết thành công!',
            'Xin cảm ơn!',
            'success'
          )
        } else {
          Swal.fire(
            'Cập nhật biểu quyết thất bại!',
            'Xin cảm ơn!',
            'error'
          )
        }
      }
      
    })

  }

  hasSelectedOption(): boolean {
    for (let item of this.toList) {
      if (this.arr.length < item.status.length) {
        return false;
      }
    }
    return true;
  }
  
  // hasSelectedOption(): boolean {
  //   return this.arr.length >= this.toList.length;
  // }
}
