import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { count, forkJoin } from 'rxjs';
import { Shareholder } from 'src/app/models/shareholder';
import { MeetingService } from 'src/app/service/meeting.service';
import { ResultVotingService } from 'src/app/service/result-voting.service';
import { ShareholderInfoService } from 'src/app/service/shareholder-info.service';
import { VotingService } from 'src/app/service/voting.service';

@Component({
  selector: 'app-result-voting',
  templateUrl: './result-voting.component.html',
  styleUrls: ['./result-voting.component.css']
})
export class ResultVotingComponent implements OnInit {
  totalShares: number = 0;
  listVotingByMeeting: any = [];
  toListVotingByMeeting: any[] = [];
  countVoting!: number
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

  constructor(private route: ActivatedRoute, private meetingService: MeetingService, private result_votingService: ResultVotingService, private shareholderService: ShareholderInfoService, private votingService: VotingService) { }
  ngOnInit(): void {
    // this.getAllResultVoting();
    setTimeout(() => {
      this.getAllResultVoting();
    }, 3000);
  }

  getAllResultVoting(): void {
    const idMeeting = this.route.snapshot.params['id'];
    this.result_votingService.getByIdMeeting(idMeeting).subscribe((res) => {
      this.resultVotings = res;
      this.toListResultVoting = Object.values(this.resultVotings.items);

      const observables = this.toListResultVoting.map(item =>
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
        this.calculateVotingResult(this.sharesCount);
      });
    });
  }

  isLoading: boolean = false;

  calculateVotingResult(totalShares: number) {
    const agreeResultVoting = this.toListResultVoting.filter((resultVoting: any) => resultVoting.status === 1);
    const disagreeResultVoting = this.toListResultVoting.filter((resultVoting: any) => resultVoting.status === 0);
    const noOpinionResultVoting = this.toListResultVoting.filter((resultVoting: any) => resultVoting.status === 2);
    const idMeeting = this.route.snapshot.params['id'];
    this.votingService.getByIdMeeting(idMeeting).subscribe((res) => {
      this.listVotingByMeeting = res;
      this.toListVotingByMeeting = Object.values(this.listVotingByMeeting.items);
      this.countVoting = this.toListVotingByMeeting.length;
      this.realShares = totalShares / this.countVoting;

      const resultsArray: { agree: number; disagree: number; noOpinion: number; }[] = []; // Mảng kết quả của các cuộc biểu quyết

      const votingPromises = this.toListVotingByMeeting.map((voting: any) => {
        const results = {
          agree: 0,
          disagree: 0,
          noOpinion: 0
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
              results.agree = (results.agree / this.realShares) * 100;
              if (isNaN(results.agree)) {
                setTimeout(() => {
                  window.location.reload();
                }, 1000)
                this.isLoading = true;
              } else {
                console.log(results.agree);
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
              results.disagree = (results.disagree / this.realShares) * 100;
              if (isNaN(results.disagree)) {
                setTimeout(() => {
                  window.location.reload();
                }, 1000)
                this.isLoading = true;
              } else {
                console.log(results.disagree);
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
              results.noOpinion = (results.noOpinion / this.realShares) * 100;
              if (isNaN(results.noOpinion)) {
                setTimeout(() => {
                  window.location.reload();
                }, 1000)
                this.isLoading = true;
              } else {
                console.log(results.noOpinion);
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
        // Hiển thị kết quả trong HTML
        this.agreeResults = resultsArray.map((results: any) => ({
          percentage: isNaN(results.agree) ? 0 : results.agree.toFixed(2)
        }));
        this.disagreeResults = resultsArray.map((results: any) => ({
          percentage: isNaN(results.disagree) ? 0 : results.disagree.toFixed(2)
        }));
        this.noOpinionResults = resultsArray.map((results: any) => ({
          percentage: isNaN(results.noOpinion) ? 0 : results.noOpinion.toFixed(2)
        }));

      });
    });
  }



}


