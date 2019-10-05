import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from 'src/app/socket.service';

@Component({
  selector: 'app-all-issue',
  templateUrl: './all-issue.component.html',
  styleUrls: ['./all-issue.component.css']
})
export class AllIssueComponent implements OnInit {
  username: string;
  userId: string;
  Issues: any;
  Issue: any;
  reporterName: any;
  IssueId: any;
  notify: boolean;
  ownuser: boolean;
  otheruser: boolean;
  addwatcher: boolean;
  editownuser: boolean;
  editotheruser: boolean;
  authToken: string;


  constructor(public service:ServiceService,private toastr: ToastrService,public route:Router,public router:ActivatedRoute,public socketService:SocketService) {
    this.userId=this.router.snapshot.paramMap.get('userId');
    this.username=Cookie.get('fullName');
    this.authToken=Cookie.get('authToken');

   }

  ngOnInit() {
    this.getallIssues();
     this.getcommentnotify();
     this.getaddwatchernotify();
     this.geteditnotify();
  }
 
  //get all Issues code start
  public getallIssues=()=>{
    this.service.getallIssue(this.authToken).subscribe(
      data=>{
        this.Issue=data.data;
      },
      err=>{
        this.toastr.error('some error occured');
      }
    )
  }
  //get all Issues code end


  //logout code start
  public logout=()=>{
    this.socketService.exitsocket();
    this.socketService.disconnectedSocket();
    Cookie.delete('userId');
    Cookie.delete('authToken');
    Cookie.delete('fullName');
    this.toastr.success('logout successfully');
    setTimeout(() => {
      this.route.navigate(['/signin']);
    },1000);
  }
   //logout code end

   
  //get commentnotification code start
  public getcommentnotify=()=>{
    this.socketService.getaddcommentnotify().subscribe(
      data=>{
        this.username=data.username;
        this.reporterName=data.reporterName;
        this.IssueId=data.IssueId;
        this.notify=false;
        if(this.username===this.reporterName) {
          this.ownuser=true;
        }
        else {
          this.otheruser=true;
        }
      },
      err=>{
        this.toastr.error('some error occured')
      }
    )
  }
  //get commentnotification code start


  //get addwatcher code is start
  public getaddwatchernotify=()=>{
    this.socketService.getaddwatchertnotify().subscribe(
      data=>{
       this.username=data.username;
       this.reporterName=data.reporterName;
       this.IssueId=data.IssueId;
       this.notify=false;
       this.addwatcher=true;
      }
    )
  }
  //get add watcher code is start


  //get editnotification code start
 public geteditnotify=()=>{
  this.socketService.geteditnotify().subscribe(
    data=>{
      this.username=data.username;
      this.reporterName=data.reporterName;
      this.IssueId=data.IssueId;
      this.notify=false;
      if(this.username===this.reporterName) {
        this.editownuser=true;
      }
      else {
        this.editotheruser=true;
      }
    },
    err=>{
      this.toastr.error('some error occured')
    }
  )
}
//get editnotification code end

}
