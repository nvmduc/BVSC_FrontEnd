import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { ClientRoutingModule } from './client-routing.module';
import { HomeComponent } from './home/home.component';
import { IndexComponent } from './index/index.component';
import { InfoShareholderComponent } from './info-shareholder/info-shareholder.component';
import { MenuComponent } from './menu/menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CandidateComponent } from './candidate/candidate.component';
import { VotingComponent } from './voting/voting.component';
import { ElectionComponent } from './election/election.component';
import { ResultMeetingComponent } from './result-meeting/result-meeting.component';

@NgModule({
  declarations: [
    HomeComponent,
    IndexComponent,
    InfoShareholderComponent,
    VotingComponent,
    ElectionComponent,
    MenuComponent,
    CandidateComponent,
    ResultMeetingComponent
  ],
  imports: [
    ClientRoutingModule,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: []
})
export class ClientModule { }
