import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { TimeoutError } from 'rxjs';
import { SocketService } from 'src/app/socket.service';

@Component({
  selector: 'app-view-issue',
  templateUrl: './view-issue.component.html',
  styleUrls: ['./view-issue.component.css']
})
export class ViewIssueComponent implements OnInit {
  userId: string;
  IssueId: any;
  Issue: any;
  comment: any;
  fullname: string;
  comments: any;
  commentlength: any;
  commentvalue: boolean;
  IssueTitle: any;
  description: any;
  status: any;
  Assignee: any;
  reporterName: any;
  IssueIdblog: any;
  ProductImage: any;
  receiverId: any;
  watchers: any;
  watchername: any;
  showwatchers: boolean;
  username: any;
  notify: boolean;
  ownuser: boolean;
  otheruser: boolean;
  addwatchernotify: boolean;
  editownuser: boolean;
  editotheruser: boolean;
  authToken: string;

  constructor(public service:ServiceService,private toastr: ToastrService,public route:Router,public router:ActivatedRoute,public socketService:SocketService) {
    this.userId=Cookie.get('userId');
    this.IssueId=this.router.snapshot.paramMap.get('IssueId');
    this.fullname=Cookie.get('fullName');
    this.authToken=Cookie.get('authToken');
   }

  ngOnInit() {
    this.getsingleIssue();
    this.getcommentnotify();
    this.getaddwatchernotify();
    this.geteditnotify();
  }



//getsingle Issue code start
  public getsingleIssue=()=>{
    this.service.getsingleIssue(this.IssueId,this.authToken).subscribe(
      data=>{
        this.Issue=data['data'];
        this.IssueTitle=this.Issue.IssueTitle;
        this.description=this.Issue.description;
        this.status=this.Issue.status;
        this.Assignee=this.Issue.Assignee;
        this.reporterName=this.Issue.reporterName;
        this.IssueIdblog=this.Issue.IssueId;
        this.ProductImage=this.Issue.ProductImage;
        this.receiverId=this.Issue.userId;
      },
      err=>{
        this.toastr.error('some error occured')
      }
    )
  }
  //get single Issue code end



//add comment code start
  public addcomment=()=>{
    if(!this.comment){
      this.toastr.error('Comment Box Is Empty');
    }
    else {
    let data={
      IssueId:this.IssueId,
      comments:this.comment,
      reportername:this.fullname,
      authToken:this.authToken
    }
    this.service.addcomment(data).subscribe(
      data=>{
        this.comment='';
        this.Issue=data.data;
        let details={
          username:this.fullname,
          reporterName:this.reporterName,
          IssueId:this.IssueId
        }
         this.socketService.addcomment(details);
        this.getcomments();
        this.toastr.success('Comment Is Successfully Added');
      },
      err=>{
        this.toastr.error('some error occured')
      }
    )
  }
}
//add comment code end


//get comments code start
  public getcomments=()=>{
    this.service.getsingleIssue(this.IssueId,this.authToken).subscribe(
      data=>{
        this.comments=data.data.comments;
        this.commentlength=data.data.comments.length;
        this.commentvalue=true;
        
        this.getsingleIssue();
      },
      err=>{
        this.toastr.error('some error occured')
      }
    )
  }
//get comments code end


//delete Issue code start
  public deleteIssue=(IssueId)=>{
    let data={
      IssueId:IssueId,
      authToken:this.authToken
    }
    this.service.deleteIssue(data).subscribe(
      data=>{
        
        this.Issue=data.data;
        let details={
          username:this.fullname,
          reporterName:this.reporterName,
          IssueId:this.IssueId
        }
        this.socketService.deleteIssue(details);
       setTimeout(() => {
          this.route.navigate(['/issue',this.userId])
       },500);
        this.toastr.success(data.message);
      },
      err=>{
        this.toastr.error('some error occured')
      }
    )
  }
//delete Issue code end


//add watcher code start
 public addwatcher=()=>{
   let data={
     watcherId:this.userId,
     receiverId:this.receiverId,
     watcherName:this.fullname,
     IssueId:this.IssueId,
     authToken:this.authToken
   }
   this.service.addwatcher(data).subscribe(
     data=>{
      if(data.error===false){
        let details={
          username:this.fullname,
          reporterName:this.reporterName,
          IssueId:this.IssueId
        }
        this.socketService.addwatcher(details);
        this.toastr.success(data.message);
      }
      else {
        this.toastr.error(data.message);
      }
     }
   )
 }
//add watcher code end


//get watchers code start
 public getwatcherlist=()=>{
   this.service.getwatcher(this.IssueId,this.authToken).subscribe(
     data=> {
       if(data.error==false){
       this.watchers=data.data;
      this.commentvalue=false;
       }
      
       else {
        this.showwatchers=true;
         
       }
     }
   )
 }
 //get watchers code end


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
      this.getsingleIssue();
      this.getcomments();
    },
    err=>{
      this.toastr.error('some error occured')
    }
  )
}
//get commentnotification code end


//get addwatcher code is start
public getaddwatchernotify=()=>{
  this.socketService.getaddwatchertnotify().subscribe(
    data=>{
     this.username=data.username;
     this.reporterName=data.reporterName;
     this.IssueId=data.IssueId;
     this.notify=false;
     this.addwatchernotify=true;
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


}
