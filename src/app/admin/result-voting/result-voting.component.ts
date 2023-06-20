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
  isLoading: boolean = false;
  agree: number = 0
  disagree: number = 0
  noOpinion: number = 0

  constructor(private route: ActivatedRoute, private result_votingService: ResultVotingService, private shareholderService: ShareholderInfoService, private votingService: VotingService) { }
  ngOnInit(): void {
    this.getAllResultVoting();
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
        const uniqueRecords: { [key: string]: any } = {}; // Đối tượng để theo dõi các bản ghi duy nhất
        this.sharesCount = 0;

        for (let res of responses) {
          this.infoShareholder = res;
          const shares =
            this.infoShareholder.items?.numberShares +
            this.infoShareholder.items?.numberSharesAuth;

          if (!uniqueRecords[this.infoShareholder.items?.id]) {
            uniqueRecords[this.infoShareholder.items?.id] = res;
            this.sharesCount += shares;
          }
        }
        this.calculateVotingResult(this.sharesCount);
      });
    });
  }

  calculateVotingResult(totalShares: number) {
    const agreeResults: any = {};
    const disagreeResults: any = {};
    const noOpinionResults: any = {};
    const agreeResultVoting = this.toListResultVoting.filter((resultVoting: any) => resultVoting.status === 1);
    const disagreeResultVoting = this.toListResultVoting.filter((resultVoting: any) => resultVoting.status === 0);
    const noOpinionResultVoting = this.toListResultVoting.filter((resultVoting: any) => resultVoting.status === 2);

    console.log(agreeResultVoting);
    console.log(disagreeResultVoting);
    console.log(noOpinionResultVoting);

    const idMeeting = this.route.snapshot.params['id'];
    this.votingService.getByIdMeeting(idMeeting).subscribe((res) => {
      this.listVotingByMeeting = res;
      this.toListVotingByMeeting = Object.values(this.listVotingByMeeting.items);
      const getCounts = []
      for (let item of this.toListResultVoting) {
        const countVoting = item.idVoting
        getCounts.push(countVoting)
      }
      // const countCandidate = getCounts.length
      this.countVoting = getCounts.length;
      const resultsArray: { agree: number; disagree: number; noOpinion: number; }[] = []; // Mảng kết quả của các cuộc biểu quyết

      const votingPromises = this.toListVotingByMeeting.map((voting: any) => {
        const results = {
          sharesAgree: 0,
          sharesDisagree: 0,
          sharesNoOpinion: 0,
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
            this.agree = 0;

            resolve();
          } else {
            Promise.all(this.observablesAgree.map(observable => observable.toPromise())).then((responses: any[]) => {
              for (let res of responses) {
                const shareholder = res;
                const shares = shareholder.items?.numberShares + shareholder.items?.numberSharesAuth;
                results.sharesAgree += shares;
              }
              // this.agree = results.agree
              results.agree = (results.sharesAgree / totalShares) * 100;
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
            this.disagree = 0;

            resolve();
          } else {
            Promise.all(this.observablesDisagree.map(observable => observable.toPromise())).then((responses: any[]) => {
              for (let res of responses) {
                const shareholder = res;
                const shares = shareholder.items?.numberShares + shareholder.items?.numberSharesAuth;
                results.sharesDisagree += shares;
              }
              // this.disagree = results.disagree
              results.disagree = (results.sharesDisagree / totalShares) * 100;
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
            this.noOpinion = 0;
            resolve();
          } else {
            Promise.all(this.observablesNoOpinion.map(observable => observable.toPromise())).then((responses: any[]) => {
              for (let res of responses) {
                const shareholder = res;
                const shares = shareholder.items?.numberShares + shareholder.items?.numberSharesAuth;
                results.sharesNoOpinion += shares;
              }
              // this.noOpinion = results.noOpinion
              results.noOpinion = (results.sharesNoOpinion / totalShares) * 100;

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

          agreeResults[voting.id] = {
            percentage: isNaN(results.agree) ? 0 : results.agree.toFixed(5),
            shares: results.sharesAgree
          };
          disagreeResults[voting.id] = {
            percentage: isNaN(results.disagree) ? 0 : results.disagree.toFixed(5),
            shares: results.sharesDisagree
          };
          noOpinionResults[voting.id] = {
            percentage: isNaN(results.noOpinion) ? 0 : results.noOpinion.toFixed(5),
            shares: results.sharesNoOpinion
          };
        });

      });
      Promise.all(votingPromises).then(() => {
        // Hiển thị kết quả trong HTML
        this.agreeResults = agreeResults;
        this.disagreeResults = disagreeResults;
        this.noOpinionResults = noOpinionResults;
      });
    });
  }



}


