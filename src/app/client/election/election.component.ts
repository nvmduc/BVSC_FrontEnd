import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResultElection } from 'src/app/models/result-election';
import { CandidateService } from 'src/app/service/candidate.service';
import { ElectionService } from 'src/app/service/election.service';
import { ResultElectionService } from 'src/app/service/result-election.service';
import { ShareholderInfoService } from 'src/app/service/shareholder-info.service';

@Component({
  selector: 'app-elention',
  templateUrl: './election.component.html',
  styleUrls: ['./election.component.css']
})
export class ElectionComponent implements OnInit {
  sumShares!: number;
  ngOnInit(): void {
    this.getAllCandidate();
    this.getInfoShareholder();
    this.inputValues = new Array(this.toListCandidateByE.length);
  }
  result: number = this.sumShares;
  constructor(private result_ElectionService: ResultElectionService, private shareholderService: ShareholderInfoService, private candidateService: CandidateService, private electionService: ElectionService, private toastr: ToastrService, private route: ActivatedRoute, private fb: FormBuilder) {
  }
  subtract() {
    const sumInputValues = this.inputValues.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    this.result = this.sumShares - sumInputValues;
  }

  numberShares!: number;
  numberSharesAuth!: number;
  inputValues: number[] = [];

  divide() {
    // Sau khi nhận được danh sách bản ghi
    const numCandidates = this.toListCandidateByE.length;

    // Khởi tạo mảng this.inputValues với số lượng phần tử tương ứng với số lượng bản ghi
    this.inputValues = Array(numCandidates).fill(0);


    const inputCount = this.inputValues.length;
    const valuePerInput = this.sumShares / inputCount;

    for (let i = 0; i < inputCount; i++) {
      this.inputValues[i] = valuePerInput;
    }

    const sumInputValues = this.inputValues.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const remainingValue = this.sumShares - sumInputValues;
    const remainingValuePerInput = remainingValue / inputCount;

    for (let i = 0; i < inputCount; i++) {
      this.inputValues[i] += remainingValuePerInput;
    }

    this.subtract();

    for (let itemElection of this.toListElection) {
      for (let itemC of this.toListCandidate) {
        if (itemElection.id == itemC.idElection) {
          const existingIndex = this.arr.findIndex(item => item.idCandidate === itemC.id);
          if (existingIndex !== -1) {
            this.arr[existingIndex].numberSharesForCandidate = valuePerInput;
          } else {
            const formValue = {
              idCandidate: itemC.id,
              idShareholder: localStorage.getItem('id'),
              numberSharesForCandidate: valuePerInput,
            }
            this.arr.push(formValue);
          }
        }
      }
    }
  }
  arr: any[] = [];
  dataResultElection: any = []
  getRE: any[] = [];

  getResultElection() {
    let inputIndex = 0;
    for (let itemElection of this.toListElection) {
      for (let itemC of this.toListCandidate) {
        if (itemElection.id == itemC.idElection) {
          const existingIndex = this.arr.findIndex(item => item.idCandidate === itemC.id);

          if (existingIndex !== -1) {
            this.arr[existingIndex].numberSharesForCandidate = this.inputValues[inputIndex];
            inputIndex++;
          } else {
            const formValue = {
              idCandidate: itemC.id,
              idShareholder: localStorage.getItem('id'),
              numberSharesForCandidate: this.inputValues[inputIndex],
            }
            this.arr.push(formValue);
            inputIndex++;
          }
        }
      }
    }
  }

  onSubmit() {
    this.result_ElectionService.getAll().subscribe((res) => {
      this.dataResultElection = [res];
      this.getRE = this.dataResultElection[0].items;
      const isExisting = this.getRE.some(item => item.idShareholder === localStorage.getItem('id'));
      if (!isExisting) {
        const formValues = [];
        for (let i = 0; i < this.arr.length; i++) {
          const formValue = {
            idCandidate: this.arr[i].idCandidate,
            idShareholder: this.arr[i].idShareholder,
            numberSharesForCandidate: this.arr[i].numberSharesForCandidate
          };
          formValues.push(formValue);
        }
        this.result_ElectionService.create(formValues).subscribe((res) => {
          if (res) {
            this.toastr.success("Biểu quyết thành công", "Thành công")
          } else {
            this.toastr.error("Biểu quyết không thành công", "Thất bại")
          }
        })
      } else {
        this.toastr.warning("Kết quả của bạn đã được ghi nhận rồi", "Thất bại")
      }
    })
  }

  selectedIds: string[] = [];
  selectCandidateId(candidateId: string) {
    if (!this.selectedIds.includes(candidateId)) {
      this.selectedIds.push(candidateId);
    }
  }

  list: any[] = [];
  toListElection: any = [];
  toListCandidate: any[] = [];

  getInfoShareholder() {
    const id = localStorage.getItem('id') || '';
    this.shareholderService.getById(id).subscribe((res: any) => {
      if (res) {
        this.data = res;
        const idMeeting = this.data.items.idMeeting
        this.getAllByMeeting(idMeeting);
        this.numberShares = this.data.items?.numberShares
        this.numberSharesAuth = this.data.items?.numberSharesAuth
      } else {
        window.location.reload();
      }
      this.sumShares = (this.numberShares + this.numberSharesAuth) * this.candidate
      this.result = this.sumShares;

    });
  }
  getAllByMeeting(idMeeting:any) {
    // const idMeeting = this.route.snapshot.params['idMeeting'];
    if(idMeeting != null){
      this.electionService.getByIdMeeting(idMeeting).subscribe((res) => {
        this.list = [res];
        this.toListElection = Object.values(this.list[0].items);
        for (let item of this.toListElection) {
          this.getAllByElection(item.id);
        }
        this.result = this.sumShares;
        this.sumShares = (this.numberShares + this.numberSharesAuth) * this.candidate;
        this.result = this.sumShares;
      });
    }else{
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  getCandidatesByElection(id: string) {
    return this.toListCandidateByE.filter((candidate: { idElection: string }) => (candidate as any).idElection === id);
  }

  toListCandidateByE: any = [];

  getAllByElection(id: string) {
    this.candidateService.getByIdElection(id).subscribe((res) => {
      this.list = [res];
      console.log(this.list[0].items.length);
      
      if(this.list[0].items.length == 0){
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }else{
        const candidates = Object.values(this.list[0].items);
        for (let candidate of candidates) {
          (candidate as any).idElection = id;
        }
        this.toListCandidateByE.push(...candidates);
  
        this.candidate = this.toListCandidateByE.length;
        this.sumShares = (this.numberShares + this.numberSharesAuth) * this.candidate;
        this.result = this.sumShares;
      }
      
    });
  }
  candidate!: number
  getAllCandidate(): void {
    this.candidateService.getAll().subscribe((res: any) => {
      this.list = [res];
      this.toListCandidate = Object.values(this.list[0].items);

    })
  }
  data: any = [];

  
  isFormValid!: boolean
  hasSelectedOption(): boolean {
    return this.arr.length >= this.toListElection.length;
  }
}
