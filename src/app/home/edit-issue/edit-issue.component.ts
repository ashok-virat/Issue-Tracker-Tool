import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from 'src/app/socket.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-edit-issue',
  templateUrl: './edit-issue.component.html',
  styleUrls: ['./edit-issue.component.css']
})
export class EditIssueComponent implements OnInit {
  file: any;
  editorConfig={
    "editable": true,
    "spellcheck": true,
    "height": "25vmin",
    "minHeight": "0",
    "width": "auto",
    "minWidth": "0",
    "translate": "yes",
    "enableToolbar": true,
    "showToolbar": true,
    "imageEndPoint": this.file,
    "toolbar": [
        ["bold", "italic", "underline", "strikeThrough", "superscript", "subscript"],
        ["fontName", "fontSize", "color"],
        ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"],
        ["cut", "copy", "delete", "removeFormat", "undo", "redo"],
        ["paragraph", "blockquote", "removeBlockquote", "horizontalLine", "orderedList", "unorderedList"]
    ]
}
  userId: string;
  username: any;
  IssueId: string;
  data: any;
  currendata: any;
  singleIssueId: any;
  users: any;
  allusers: any[];
  fullname: string;
  imagePreview: string;
  notify: boolean;
  ownuser: boolean;
  otheruser: boolean;
  addwatcher: boolean;
  editownuser: boolean;
  editotheruser: boolean;
  authToken: string;
  public productImage: any;
  public IssueTitle:string;
  public Assignee: any;
  public status: any;
  public description: any;
  public reporterName: any;
  signuploader: boolean;

  constructor(public service:ServiceService,private toastr: ToastrService,public route:Router,public router:ActivatedRoute,public socketService:SocketService) {
    this.userId=Cookie.get('userId');
    this.IssueId=this.router.snapshot.paramMap.get('IssueId');
    this.username=Cookie.get('fullName');
    this.authToken=Cookie.get('authToken');
   }

  ngOnInit() {
    this.getsingleIssue();
    this.getusers();
    this.getcommentnotify();
    this.getaddwatchernotify();
    this.geteditnotify();
  }


  //get singleIssue code estart
public getsingleIssue=()=>{
    this.service.getsingleIssue(this.IssueId,this.authToken).subscribe(
      data=>{
         this.currendata=data["data"];    
         this.IssueTitle=this.currendata.IssueTitle;
         this.description=this.currendata.description;
         this.reporterName=this.currendata.reporterName;
          this.Assignee=this.currendata.Assignee;
          this.status=this.currendata.status;
          this.productImage=this.currendata.ProductImage;
       },
       err=>{
         this.toastr.error('some error occured')
       }
    )
}
//get singleIssue code end


//get users code start
public getusers=()=>{
  this.service.getallusers(this.authToken).subscribe(
    data=>{
      this.users=data.data;
      this.allusers=[];
      for(let names of this.users){
        if(`${names.firstName} ${names.lastName}` != this.username){
          this.fullname=`${names.firstName} ${names.lastName}`;
          this.allusers.push(this.fullname);
        }
      }
    },
    err=>{
      this.toastr.error('some error occured');
    }
  )
 }
//get users code end


 //image selection code end
 public imageselect(event){
  this.file=event.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    this.imagePreview = reader.result.toString();
}
reader.readAsDataURL(this.file)
}
//image selection code end


//update Issue code start
public updateIssue=()=>{
  this.signuploader=false;
  if (this.file) {
    this.currendata.Image = this.file;
    this.currendata.name = this.file.name;
  }
  this.currendata.IssueTitle=this.IssueTitle;
  this.currendata.description=this.description;
  this.currendata.Assignee=this.Assignee;
  this.currendata.status=this.status;
   this.service.update(this.currendata,this.IssueId,this.authToken).subscribe(
     data=>{
      this.signuploader=true;
       let details={
           username:this.username,
           reporterName:this.reporterName,
           IssueId:this.IssueId
       }
       this.socketService.addeditnotify(details);
       setTimeout(() => {
        this.route.navigate(["/View-Issue",this.IssueId])
       },2000);
       this.toastr.success(data.message)
     },err=>{
      this.signuploader=true;
       this.toastr.error('some error occured')
     }
   )
}

//update Issue code end


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
      }
    )
  }
  //get add watcher code is start
 

  //edit-Issue notification code start
  public addeditnotify=()=>{
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
  //edit-Issue notification code end


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
