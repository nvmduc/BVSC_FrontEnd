import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { count, forkJoin } from 'rxjs';
import { CandidateService } from 'src/app/service/candidate.service';
import { ElectionService } from 'src/app/service/election.service';
import { ResultElectionService } from 'src/app/service/result-election.service';
import { ShareholderInfoService } from 'src/app/service/shareholder-info.service';

@Component({
  selector: 'app-result-election',
  templateUrl: './result-election.component.html',
  styleUrls: ['./result-election.component.css']
})
export class ResultElectionComponent implements OnInit {
  constructor(private candidateService: CandidateService, private electionService: ElectionService, private shareholderService: ShareholderInfoService, private result_ElectionService: ResultElectionService, private route: ActivatedRoute) { }
  ngOnInit(): void {
    // setTimeout(() => {
    this.getElectionByIdMeeting();
    this.getAllCandidate();
    this.getAllResultElection();
    // }, 2000);
  }
  resultElections: any = [];
  toListResultElection: any[] = [];
  infoShareholder: any = [];
  sharesCount: number = 0;
  countCandidate: number = 0;
  getElectionByIdMeeting() {
    const idMeeting = this.route.snapshot.params['id'];
    this.electionService.getByIdMeeting(idMeeting).subscribe((res) => {
      this.listElectionByMeeting = res;
      this.toListElectionByMeeting = Object.values(this.listElectionByMeeting.items);
    })
  }
  listCandidate: any = [[]]
  toListCandidate: any[] = []
  getAllCandidate(): void {
    const idMeeting = this.route.snapshot.params['id'];
    this.candidateService.getByIdMeeting(idMeeting).subscribe((res: any) => {
      this.listCandidate = [res];
      this.toListCandidate = Object.values(this.listCandidate[0].items);
    })
  }
  getAllResultElection(): void {
    const idMeeting = this.route.snapshot.params['id'];
    this.result_ElectionService.getByIdMeeting(idMeeting).subscribe((res) => {
      this.resultElections = res;
      this.toListResultElection = Object.values(this.resultElections.items);

      const observables = this.toListResultElection.map(item =>
        this.shareholderService.getById(item.idShareholder)
      );
      forkJoin(observables).subscribe(responses => {
        for (let res of responses) {
          this.infoShareholder = res;
          const shares =
            this.infoShareholder.items?.numberShares +
            this.infoShareholder.items?.numberSharesAuth;
          this.sharesCount += shares;
        }
        const getCounts = []
        for (let item of this.toListResultElection) {
          const countCandidate = item.idCandidate
          getCounts.push(countCandidate)
        }
        const countCandidate = getCounts.length
        this.totalSharesOfShareholders = this.sharesCount / countCandidate
        this.calculateElectionResult(this.totalSharesOfShareholders);
      });
    });
  }

  totalSharesOfShareholders!: number
  listElectionByMeeting: any = [];
  toListElectionByMeeting: any[] = [];
  candidatePercentages: any[] = []
  candidateList: any[] = [];
  infoCandidate: any = []
  totalSharesOfCandidate!: number;
  isLoading: boolean = false;

  calculateElectionResult(totalShares: number) {
    this.totalSharesOfShareholders = totalShares;
    if (isNaN(totalShares)) {
      setTimeout(() => {
        window.location.reload();
      }, 1000)
      this.isLoading = true;
    }
    const candidatePercentages: { idElection: string; idCandidate: number; percentage: number; totalShares: number; fullname: string }[] = [];
    const candidateSharesMap = new Map<number, number>();

    for (const item of this.toListResultElection) {
      const idCandidate = item.idCandidate;
      const idElection = item.idElection;
      const numberSharesForCandidate = item.numberSharesForCandidate;

      if (candidateSharesMap.has(idCandidate)) {
        const currentShares = candidateSharesMap.get(idCandidate);
        candidateSharesMap.set(idCandidate, currentShares + numberSharesForCandidate);
        this.totalSharesOfCandidate = currentShares + numberSharesForCandidate
        if (isNaN(this.totalSharesOfCandidate)) {
          setTimeout(() => {
            window.location.reload();
          }, 1000)
          this.isLoading = true;
        }
      } else {
        candidateSharesMap.set(idCandidate, numberSharesForCandidate);
      }
    }
    candidateSharesMap.forEach((shares, candidateId) => {
      const candidatePercent = (shares / totalShares) * 100;
      const candidate: { idCandidate: number; percentage: number; totalShares: number; fullname: string; idElection: string; } = {
        idElection: "",
        idCandidate: candidateId,
        percentage: candidatePercent,
        totalShares: shares,
        fullname: '',
      };
      this.candidateService.getById(candidateId).subscribe((res) => {
        this.infoCandidate = res;
        candidate.fullname = this.infoCandidate.items?.fullname;
        candidate.idElection = this.infoCandidate.items?.idElection;
      });
      candidatePercentages.push(candidate);
    });
    this.candidatePercentages = candidatePercentages;
    console.log(this.candidatePercentages);
    
    this.candidatePercentages.sort((a, b) => b.percentage - a.percentage);
    this.countCandidate = this.candidatePercentages.length
    const listItem = []
    for(let item1 of this.toListElectionByMeeting){
      this.candidateService.getByIdElection(item1.id).subscribe((res)=>{
        this.listCandidateByE = res;
        this.toListCandidateByE = this.listCandidateByE.item
        console.log(this.toListCandidateByE);
        
      })
      
    }
    
    
  }
  listCandidateByE:any = [];
  toListCandidateByE:any = []
}
