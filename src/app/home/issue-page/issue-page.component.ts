import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from 'src/app/socket.service';


@Component({
  selector: 'app-issue-page',
  templateUrl: './issue-page.component.html',
  styleUrls: ['./issue-page.component.css']
})
export class IssuePageComponent implements OnInit {
  fullname: any;
  userId: any;
  Issue: any;
  Issuelength: any;
  notify: any;
  username: any;
  reporterName: any;
  IssueId: boolean;
  ownuser: any;
  otheruser: boolean;
  time: number;
  addwatcher: boolean;
  editownuser: boolean;
  editotheruser: boolean;
  authToken: string;

  constructor(public service:ServiceService,private toastr: ToastrService,public route:Router,public router:ActivatedRoute,public socketService:SocketService) {
     this.fullname=Cookie.get('fullName');
     this.userId=this.router.snapshot.paramMap.get('userId');
     this.authToken=Cookie.get('authToken');
     Cookie.set('userId',this.userId);
   }

  ngOnInit() {
    this.getmyIssue();
    this.verifyUser();
    this.getonlineUsers();
    this.getdeletenotify();
    this.getcommentnotify();
    this.getaddwatchernotify();
    this.geteditnotify();
  }


  //verify user code start
  public verifyUser=()=>{
    this.socketService.verifyUser().subscribe(
      data=>{
        this.socketService.setUser(this.userId);
      },
      err=>{
        this.toastr.error('some error occured')
      }
    )
}
//verify user code end


//get online users code start
public getonlineUsers=()=>{
  this.socketService.onlineUserList().subscribe(
    data=>{
    },
    err=>{
      this.toastr.error('some error occured')
    }
  )
}
//get online users code end


//get sinlge Issue code start
  public getmyIssue=()=>{
     this.service.getmyIssue(this.userId,this.authToken).subscribe(
       data=>{
         this.Issue=data.data;
         setInterval(() => {
          this.time = Date.now();
        }, 1);
         if(this.Issue==null){
           this.Issuelength=0;
         }
         else if(this.Issue.length>0){
         this.Issuelength=this.Issue.length;
         }
       },
       err=>{
         this.toastr.error('some error occured');
       }
     )
  }
  //get  single Issue code end


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

  
  //get deletenotification code start
public getdeletenotify=()=>{
  this.socketService.gettingdeleteIssue().subscribe(
    data=>{
      this.username=data.username;
      this.reporterName=data.reporterName;
      this.IssueId=data.IssueId;
      if(this.username===this.reporterName) {
        this.toastr.success(`${this.username} deleted his Issue`);
      }
      else {
        this.toastr.success(`${this.username} deleted ${this.reporterName} Issue`);
      }
    },
    err=>{
      this.toastr.error('some error occured');
    }
  )
}
 //get deletenotification code end


 //get commentnotification code start
public getcommentnotify=()=>{
  this.socketService.getaddcommentnotify().subscribe(
    data=>{
      this.username=data.username;
      this.reporterName=data.reporterName;
      this.IssueId=data.IssueId;
      this.notify=false;
    if(this.username===this.reporterName) {
      this.toastr.success(`${this.username} commented his Issue`);
      this.ownuser=true;
    }
    else {
      this.toastr.success(`${this.username} commented ${this.reporterName} Issue`);
      this.otheruser=true;
    }
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
      this.addwatcher=true;
       this.toastr.success(`${this.username} added in ${this.reporterName} watcher list`);
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
        this.toastr.success(`${this.username} edited his Issue`);
      }
      else {
        this.toastr.success(`${this.username} edited ${this.reporterName} Issue`);
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
