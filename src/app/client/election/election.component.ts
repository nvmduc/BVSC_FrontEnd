import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Legend } from 'chart.js';
import { values } from 'lodash';
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
  // result: number = this.sumShares;
  constructor(private result_ElectionService: ResultElectionService, private shareholderService: ShareholderInfoService, private candidateService: CandidateService, private electionService: ElectionService, private toastr: ToastrService, private route: ActivatedRoute, private fb: FormBuilder) {
  }

  numberSharesAuth!: number;
  numberShares!: number;

  divide(id: any) {
    const candidates = this.getCandidatesByElection(id);
    const totalCandidates = candidates.length;
    const equalShares = Math.floor(this.totalShares[id] / totalCandidates);

    candidates.forEach((itemC: any) => {
      this.inputValues[itemC.id] = equalShares;
      this.subtract(id);
    });
    this.getResultElection();

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
            this.arr[existingIndex].numberSharesForCandidate = this.inputValues[itemC.id];
            inputIndex++;
          } else {
            const formValue = {
              idCandidate: itemC.id,
              idShareholder: localStorage.getItem('id'),
              numberSharesForCandidate: this.inputValues[itemC.id],
            }
            this.arr.push(formValue);
            inputIndex++;
          }
        }
      }
    }
  }

  subtract(idE: any) {
    const isExisting = this.toListCandidateByE.filter((item: any) => item.idElection === idE);
    const sumInputValues = this.inputValues.reduce((accumulator: number, currentValue: number, currentIndex: any) => {
      if (isExisting.find((item: any) => item.id === currentIndex)) {
        return accumulator + currentValue;
      }
      return accumulator;
    }, 0);
    this.resultShares[idE] = this.totalShares[idE] - sumInputValues;
  }

  onSubmit() {
    this.result_ElectionService.getAll().subscribe((res) => {
      this.dataResultElection = res;
      this.getRE = this.dataResultElection.items;
      console.log(this.dataResultElection);
      
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
        const isExisting = this.getRE.filter(item => item.idShareholder === localStorage.getItem('id'));
        const idArray = isExisting.map(item => item.id);

        const formValues = [];
        for (let i = 0; i < this.arr.length; i++) {
          const formValue = {
            id: idArray[i],
            numberSharesForCandidate: this.arr[i].numberSharesForCandidate
          };
          formValues.push(formValue);
        }
        for(let item of formValues){
          this.result_ElectionService.update(item.id, formValues).subscribe((res) => {
            if (res) {
              this.toastr.success("Cập nhật kết quả thành công", "Thành công")
            } else {
              this.toastr.error("Cập nhật không thành công", "Thất bại")
            }
          })
        }
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
    });
  }
  resultShares: number[] = []
  inputValues: number[] = [];
  totalShares: number[] = [];
  inputNames: string[] = [];

  getAllByMeeting(idMeeting: any) {
    // const idMeeting = this.route.snapshot.params['idMeeting'];
    if (idMeeting != null) {
      this.electionService.getByIdMeeting(idMeeting).subscribe((res) => {
        this.list = [res];
        this.toListElection = Object.values(this.list[0].items);
        for (let item of this.toListElection) {
          this.getAllByElection(item.id);
          this.totalShares[item.id] = (this.numberShares + this.numberSharesAuth) * item.numberOfElected;
          this.subtract(item.id)
        }

      });
    } else {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  getAllByElection(id: string) {
    this.candidateService.getByIdElection(id).subscribe((res) => {
      this.list = [res];

      if (this.list[0].items.length == 0) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const candidates = Object.values(this.list[0].items);
        for (let candidate of candidates) {
          (candidate as any).idElection = id;
          // this.inputNames.push(`shares${this.inputNames.length}`);
        }
        this.toListCandidateByE.push(...candidates);
      }

    });
  }
  getCandidatesByElection(id: string) {
    return this.toListCandidateByE.filter((candidate: { idElection: string }) => (candidate as any).idElection === id);
  }

  toListCandidateByE: any = [];


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
