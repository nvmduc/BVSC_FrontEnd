import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckinComponent } from './checkin/checkin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ElectionComponent } from './election/election.component';
import { ResultElectionComponent } from './result-election/result-election.component';
import { ResultVotingComponent } from './result-voting/result-voting.component';
import { ShareholderComponent } from './shareholder/shareholder.component';
import { VotingComponent } from './voting/voting.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
    ]
  },
  {path: 'shareholder/:id', component: ShareholderComponent},
  {path: 'voting/:id', component: VotingComponent},
  {path: 'election/:id', component: ElectionComponent},
  {path: 'checkin/:idS', component: CheckinComponent},
  {path: 'result-voting/:id', component: ResultVotingComponent},
  {path: 'result-election/:id', component: ResultElectionComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
