import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssuePageComponent } from './issue-page/issue-page.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CreateIssueComponent } from './create-issue/create-issue.component';
import { NgxEditorModule } from 'ngx-editor';
import { AllIssueComponent } from './all-issue/all-issue.component';
import { ViewIssueComponent } from './view-issue/view-issue.component';
import { EditIssueComponent } from './edit-issue/edit-issue.component';
import { PipePipe } from './pipe.pipe';


@NgModule({
  declarations: [IssuePageComponent, CreateIssueComponent, AllIssueComponent, ViewIssueComponent, EditIssueComponent, PipePipe],
  imports: [
    CommonModule,
    FormsModule,
    NgxEditorModule,
    RouterModule.forChild ([
      {path:"issue/:userId",component:IssuePageComponent},
      {path:'create-Issue/:userId',component:CreateIssueComponent},
      {path:'all-Issue/:userId',component:AllIssueComponent},
      {path:'View-Issue/:IssueId',component:ViewIssueComponent},
      {path:'edit-Issue/:IssueId',component:EditIssueComponent}
    ])
  ]
})
export class HomeModule { }
