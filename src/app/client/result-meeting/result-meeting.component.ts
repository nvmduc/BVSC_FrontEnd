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

    const idMeeting = this.route.snapshot.params['idMeeting'];
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
  listRE:any = [];
  electionTotals:any =[];
  getAllResultElection(): void {
    const idMeeting = this.route.snapshot.params['idMeeting'];
    this.electionService.getByIdMeeting(idMeeting).subscribe((elections: any) => {
      this.toListElectionByMeeting = elections.items;

      const shareholderSharesMap = new Map<number, number>();
      const idEMap = new Map<string, number>();
      const idCandidateMap = new Map<number, number>();
      const resultObservables = this.toListElectionByMeeting.map(itemE => {
        return this.result_ElectionService.getByIdElection(itemE.id);
      });
      forkJoin(resultObservables).subscribe((resultElectionsArray: any[]) => {
        for (let index = 0; index < resultElectionsArray.length; index++) {
          const resultElections = resultElectionsArray[index];
          const itemE = this.toListElectionByMeeting[index];
          this.resultElections = resultElections;
          this.toListResultElection = Object.values(this.resultElections.items).map((item: any) => {
            return { ...item, idE: itemE.id };
          });
          this.listRE.push(...this.toListResultElection);

          const electionId = itemE.id;
          const electionTotal = this.toListResultElection.reduce((total: number, item: any) => {
            return total + item.numberSharesForCandidate;
          }, 0);
          this.electionTotals[electionId] = electionTotal;



          for (const item of this.toListResultElection) {
            const idE = item.idE;
            const numberSharesForCandidate = item.numberSharesForCandidate;

            if (idEMap.has(idE)) {
              const currentShares = idEMap.get(idE);
              idEMap.set(idE, currentShares + numberSharesForCandidate);
            } else {
              idEMap.set(idE, numberSharesForCandidate);
            }

            const idCandidate = item.idCandidate;

            if (idCandidateMap.has(idCandidate)) {
              const currentShares = idCandidateMap.get(idCandidate);
              idCandidateMap.set(idCandidate, currentShares + numberSharesForCandidate);
            } else {
              idCandidateMap.set(idCandidate, numberSharesForCandidate);
            }
          }
          console.log(idEMap);
          console.log(idCandidateMap);
        }
        const candidatePercentages: {
          idElection: string;
          idCandidate: number;
          percentage: number;
          totalShares: number;
          shares: number;
          fullname: string;
        }[] = [];

        const sharesCount: { [idE: string]: number } = {};

        idEMap.forEach((totalShares, idE) => {
          this.result_ElectionService.getByIdElection(String(idE)).subscribe((res: any) => {
            const shareholderIds = res.items.map((item: any) => item.idShareholder);
            const observables = shareholderIds.map((shareholderId: string) =>
              this.shareholderService.getById(shareholderId)
            );
            forkJoin(observables).subscribe((responses: any) => {
              const uniqueResponses = responses.filter((response: any, index: number) => {
                const currentIndex = responses.findIndex((res: any) => {
                  return (
                    res.items?.idShareholder === response.items?.idShareholder &&
                    res.items?.numberShares === response.items?.numberShares &&
                    res.items?.numberSharesAuth === response.items?.numberSharesAuth
                  );
                });
                return currentIndex === index;
              });
              const sharesCountForIdE = uniqueResponses.reduce((totalShares: number, response: any) => {
                const shareholderShares =
                  response.items?.numberShares + response.items?.numberSharesAuth;
                return totalShares + shareholderShares;
              }, 0);
              sharesCount[idE] = sharesCountForIdE;
              calculateCandidatePercentages(String(idE));
            });
          });

        });

        const calculateCandidatePercentages = (idE: string): void => {
          const candidatePercentages: any[] = [];
          const updatedCandidates: any[] = [];

          idCandidateMap.forEach((totalSharesOfCandidate, idC) => {

            const candidate: {
              idCandidate: number;
              percentage: number;
              totalShares: number;
              shares: number;
              fullname: string;
              idElection: string;
            } = {
              idElection: '',
              idCandidate: idC,
              percentage: 0,
              totalShares: 0,
              shares: totalSharesOfCandidate,
              fullname: '',
            };
            this.candidateService.getById(idC).subscribe((res) => {
              this.infoCandidate = res;
              const fullname = this.infoCandidate.items?.fullname;
              const idElection = this.infoCandidate.items?.idElection;

              if (idElection === this.infoCandidate.items?.idElection) {
                const totalShares = sharesCount[idElection];
                const candidatePercent = (totalSharesOfCandidate / totalShares) * 100;

                const updatedCandidate = {
                  ...candidate,
                  fullname: fullname,
                  idElection: idElection,
                  totalShares: totalShares,
                  percentage: candidatePercent
                };
                updatedCandidates.push(updatedCandidate);
                this.candidatePercentages = updatedCandidates.sort((a, b) => b.percentage - a.percentage);
              }
            });
          });
        };
      });
    });
    this.candidatePercentages.sort((a, b) => a.percentage - b.percentage);
    
  }

}
