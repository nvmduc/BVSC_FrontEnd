import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IndexComponent } from './index/index.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { ShareholderComponent } from './shareholder/shareholder.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CandidateComponent } from './candidate/candidate.component';
import { VotingComponent } from './voting/voting.component';
import { SearchShareholderPipe } from '../search-shareholder.pipe';
import { MeetingComponent } from './meeting/meeting.component';
import { MatIconModule } from '@angular/material/icon';
import { ElectionComponent } from './election/election.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CheckinComponent } from './checkin/checkin.component';
import { ResultVotingComponent } from './result-voting/result-voting.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ResultElectionComponent } from './result-election/result-election.component';
import { FeedbackComponent } from './feedback/feedback.component';

@NgModule({
  declarations: [
    DashboardComponent,
    IndexComponent,
    SidebarComponent,
    HeaderComponent,
    ShareholderComponent,
    CandidateComponent,
    VotingComponent,
    ElectionComponent,
    SearchShareholderPipe,
    MeetingComponent,
    ElectionComponent,
    CheckinComponent,
    ResultVotingComponent,
    ResultElectionComponent,
    FeedbackComponent,
  ],
  imports: [
    AdminRoutingModule,
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    NgxPaginationModule,
    NgApexchartsModule
  ],
  providers: [DatePipe,DecimalPipe],
  bootstrap: []
})
export class AdminModule { }
