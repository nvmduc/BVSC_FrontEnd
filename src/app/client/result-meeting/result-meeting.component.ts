import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CandidateService } from 'src/app/service/candidate.service';
import { ElectionService } from 'src/app/service/election.service';
import { MeetingService } from 'src/app/service/meeting.service';
import { ResultElectionService } from 'src/app/service/result-election.service';
import { ResultVotingService } from 'src/app/service/result-voting.service';
import { ShareholderInfoService } from 'src/app/service/shareholder-info.service';
import { VotingService } from 'src/app/service/voting.service';

@Component({
  selector: 'app-result-meeting',
  templateUrl: './result-meeting.component.html',
  styleUrls: ['./result-meeting.component.css']
})
export class ResultMeetingComponent implements OnInit {
  totalShares: number = 0;
  listVotingByMeeting: any = [];
  toListVotingByMeeting: any[] = [];
  countVoting: number = 0
  toListResultVoting: any[] = [];
  resultVotings: any = []
  sharesCount: number = 0;
  infoShareholder: any = []
  realShares!: number;
  observablesAgree: any[] = []
  observablesDisagree: any[] = []
  observablesNoOpinion: any[] = []
  agreeResults: any = [];
  disagreeResults: any = [];
  noOpinionResults: any = [];
  isLoading: boolean = false;
  agree: number = 0
  disagree: number = 0
  noOpinion: number = 0
  totalSharesOfShareholders!: number
  listElectionByMeeting: any = [];
  toListElectionByMeeting: any[] = [];
  candidatePercentages: any[] = []
  candidateList: any[] = [];
  infoCandidate: any = []
  totalSharesOfCandidate!: number;

  constructor(private candidateService: CandidateService, private electionService: ElectionService,
    private result_ElectionService: ResultElectionService, private route: ActivatedRoute, private result_votingService: ResultVotingService,
    private shareholderService: ShareholderInfoService, private votingService: VotingService) { }
  ngOnInit(): void {
    this.getAllResultVoting();
    this.getElectionByIdMeeting();
    this.getAllCandidate();
    this.getAllResultElection();
  }


  getAllResultVoting(): void {
    const idMeeting = this.route.snapshot.params['idMeeting'];
    this.result_votingService.getByIdMeeting(idMeeting).subscribe((res) => {
      this.resultVotings = res;
      this.toListResultVoting = this.resultVotings.items;
      const observables = this.toListResultVoting.map(item => this.shareholderService.getById(item.idShareholder));
      forkJoin(observables).subscribe(responses => {
        for (let res of responses) {
          this.infoShareholder = res;
          const shares =
            this.infoShareholder.items?.numberShares +
            this.infoShareholder.items?.numberSharesAuth;
          this.sharesCount += shares;
        }
        this.calculateVotingResult(this.sharesCount);
      });
    });
  }

  calculateVotingResult(totalShares: number) {
    const agreeResultVoting = this.toListResultVoting.filter((resultVoting: any) => resultVoting.status === 1);
    const disagreeResultVoting = this.toListResultVoting.filter((resultVoting: any) => resultVoting.status === 0);
    const noOpinionResultVoting = this.toListResultVoting.filter((resultVoting: any) => resultVoting.status === 2);
    const idMeeting = this.route.snapshot.params['idMeeting'];
    this.votingService.getByIdMeeting(idMeeting).subscribe((res) => {
      this.listVotingByMeeting = res;
      this.toListVotingByMeeting = Object.values(this.listVotingByMeeting.items);
      this.countVoting = this.toListVotingByMeeting.length;
      this.realShares = totalShares / this.countVoting;
      const resultsArray: { agree: number; disagree: number; noOpinion: number; }[] = []; // Mảng kết quả của các cuộc biểu quyết
      const votingPromises = this.toListVotingByMeeting.map((voting: any) => {
        const results = {
          agree: this.agree,
          disagree: this.disagree,
          noOpinion: this.noOpinion,
        };

        const agreePromise = new Promise<void>((resolve) => {
          this.observablesAgree = agreeResultVoting
            .filter((resultVoting: any) => resultVoting.idVoting === voting.id)
            .map((item: any) => this.shareholderService.getById(item.idShareholder));

          if (this.observablesAgree.length === 0) {
            results.agree = 0;
            resolve();
          } else {
            Promise.all(this.observablesAgree.map(observable => observable.toPromise())).then((responses: any[]) => {
              for (let res of responses) {
                this.infoShareholder = res;
                const shareholder = res;
                const shares = shareholder.items?.numberShares + shareholder.items?.numberSharesAuth;
                results.agree += shares;
              }
              this.agree = results.agree

              results.agree = (results.agree / this.realShares) * 100;
              if (isNaN(results.agree)) {
                setTimeout(() => {
                  window.location.reload();
                }, 1000)
                this.isLoading = true;
              } else {
                resolve();
              }
            });
          }
        });

        const disagreePromise = new Promise<void>((resolve) => {
          this.observablesDisagree = disagreeResultVoting
            .filter((resultVoting: any) => resultVoting.idVoting === voting.id)
            .map((item: any) => this.shareholderService.getById(item.idShareholder));

          if (this.observablesDisagree.length === 0) {
            results.disagree = 0;
            resolve();
          } else {
            Promise.all(this.observablesDisagree.map(observable => observable.toPromise())).then((responses: any[]) => {
              for (let res of responses) {
                this.infoShareholder = res;
                const shareholder = res;
                const shares = shareholder.items?.numberShares + shareholder.items?.numberSharesAuth;
                results.disagree += shares;
              }
              this.disagree = results.disagree
              results.disagree = (results.disagree / this.realShares) * 100;
              if (isNaN(results.disagree)) {
                setTimeout(() => {
                  window.location.reload();
                }, 1000)
                this.isLoading = true;
              } else {
                resolve();
              }
            });
          }
        });

        const noOpinionPromise = new Promise<void>((resolve) => {
          this.observablesNoOpinion = noOpinionResultVoting
            .filter((resultVoting: any) => resultVoting.idVoting === voting.id)
            .map((item: any) => this.shareholderService.getById(item.idShareholder));

          if (this.observablesNoOpinion.length === 0) {
            results.noOpinion = 0;
            resolve();
          } else {
            Promise.all(this.observablesNoOpinion.map(observable => observable.toPromise())).then((responses: any[]) => {
              for (let res of responses) {
                this.infoShareholder = res;
                const shareholder = res;
                const shares = shareholder.items?.numberShares + shareholder.items?.numberSharesAuth;
                results.noOpinion += shares;
              }
              this.noOpinion = results.noOpinion
              results.noOpinion = (results.noOpinion / this.realShares) * 100;
              if (isNaN(results.noOpinion)) {
                setTimeout(() => {
                  window.location.reload();
                }, 1000)
                this.isLoading = true;
              } else {
                resolve();
              }
            });
          }
        });

        return Promise.all([agreePromise, disagreePromise, noOpinionPromise]).then(() => {
          resultsArray.push(results);
        });
      });
      Promise.all(votingPromises).then(() => {
        this.agreeResults = resultsArray.map((results: any) => ({
          percentage: isNaN(results.agree) ? 0 : results.agree.toFixed(2), shares: this.agree
        }));
        this.disagreeResults = resultsArray.map((results: any) => ({
          percentage: isNaN(results.disagree) ? 0 : results.disagree.toFixed(2), shares: this.disagree
        }));
        this.noOpinionResults = resultsArray.map((results: any) => ({
          percentage: isNaN(results.noOpinion) ? 0 : results.noOpinion.toFixed(2), shares: this.noOpinion
        }));
      });

    });
  }

  resultElections: any = [];
  toListResultElection: any[] = [];
  // infoShareholder: any = [];
  sharesCountElection: number = 0;
  countCandidate: number = 0;
  getElectionByIdMeeting() {
    const idMeeting = this.route.snapshot.params['idMeeting'];
    this.electionService.getByIdMeeting(idMeeting).subscribe((res) => {
      this.listElectionByMeeting = res;
      this.toListElectionByMeeting = Object.values(this.listElectionByMeeting.items);
    })
  }
  listCandidate: any = [[]]
  toListCandidate: any[] = []
  getAllCandidate(): void {
    const idMeeting = this.route.snapshot.params['idMeeting'];
    this.candidateService.getByIdMeeting(idMeeting).subscribe((res: any) => {
      this.listCandidate = [res];
      this.toListCandidate = Object.values(this.listCandidate[0].items);
    })
  }
  getAllResultElection(): void {
    const idMeeting = this.route.snapshot.params['idMeeting'];
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
          this.sharesCountElection += shares;
        }
        const countCandidate = this.toListCandidate.length
        this.totalSharesOfShareholders = this.sharesCountElection / countCandidate
        this.calculateElectionResult(this.totalSharesOfShareholders);
      });
    });
  }

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
    this.candidatePercentages.sort((a, b) => b.percentage - a.percentage);

  }

}
