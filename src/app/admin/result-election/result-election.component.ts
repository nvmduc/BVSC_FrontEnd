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

  totalSharesOfShareholders!: number
  listElectionByMeeting: any = [];
  toListElectionByMeeting: any[] = [];
  candidatePercentages: any[] = []
  candidateList: any[] = [];
  infoCandidate: any = []
  totalSharesOfCandidate!: number;
  isLoading: boolean = false;
  listCandidateByElection: any = [];
  toListCandidateByElection: any[] = [];

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

  totalShares!: number
  listResultByElection: any = []
  listElection: any = []
  listRE: any[] = []
  totals: any = {};
  percentages: any = {}; // Add a percentages property to store the calculated percentages

  electionTotals: any = {}; // Object to store the total shares for each election

  getAllResultElection(): void {
    const idMeeting = this.route.snapshot.params['id'];
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
                candidatePercentages.push(updatedCandidate);
              }
            });
            this.candidatePercentages = candidatePercentages;
          });
        };
      });
    });
    this.candidatePercentages.sort((a, b) => b.percentage - a.percentage);
  }

}


