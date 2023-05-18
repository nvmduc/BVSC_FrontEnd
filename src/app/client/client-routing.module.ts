import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ElectionComponent } from './election/election.component';
import { VotingComponent } from './voting/voting.component';

const routes: Routes = [
    {
      path: '',
      component: HomeComponent,
      children: [
        {
          path: 'home/:idMeeting',
          component: HomeComponent
        },
        
      ]
    },
    {
      path: 'voting/:idMeeting',
      component: VotingComponent
    },
    {
      path: 'election/:idMeeting',
      component: ElectionComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
