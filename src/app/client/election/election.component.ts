import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CandidateService } from 'src/app/service/candidate.service';
import { ElectionService } from 'src/app/service/election.service';
import { ResultElectionService } from 'src/app/service/result-election.service';
import { ShareholderInfoService } from 'src/app/service/shareholder-info.service';
import Swal from 'sweetalert2';

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
        if (itemElection.id == itemC.idElection && itemElection.status == 0) {
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
    this.result_ElectionService.getAll().subscribe(async (res) => {
      this.dataResultElection = res;
      this.getRE = this.dataResultElection.items;
      const isExistingArr = this.arr.map(item => item.idCandidate);
      let isNew = true;
      for (let itemC of isExistingArr) {
        const isExisting = this.getRE.filter(item => item.idShareholder === localStorage.getItem('id') && item.idCandidate == itemC);

        if (isExisting.length != 0) {
          isNew = false;
          break;
        }
      }

      if (isNew) {
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
            Swal.fire(
              'Bầu cử thành công!',
              'You clicked the button!',
              'success'
            )
          } else {
            Swal.fire(
              'Bầu cử không thành công!',
              'You clicked the button!',
              'error'
            )
          }
        });
      } else {
        const updatePromises = [];
        const ids = [];
        for (let itemC of isExistingArr) {
          const isExisting = this.getRE.filter(item => item.idShareholder === localStorage.getItem('id') && item.idCandidate == itemC);
          const isExistingIds = isExisting.map(item => item.id);
          ids.push(isExistingIds[0]);
        }
        const formValues = [];
        for (let i = 0; i < this.arr.length; i++) {
          const formValue = {
            id: ids[i],
            numberSharesForCandidate: this.arr[i].numberSharesForCandidate
          };
          formValues.push(formValue);
        }
        for (let id of ids) {
          this.result_ElectionService.update(id, formValues).subscribe();
        }
        const results = await Promise.all(formValues);
        const isSuccess = results.every((res) => res);

        if (isSuccess) {
          Swal.fire(
            'Cập nhật bầu cử thành công!',
            'You clicked the button!',
            'success'
          )
        } else {
          Swal.fire(
            'Cập nhật bầu cử thất bại!',
            'You clicked the button!',
            'error'
          )
        }
      }
    });
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
