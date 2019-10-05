import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { SocketService } from 'src/app/socket.service';

@Component({
  selector: 'app-create-issue',
  templateUrl: './create-issue.component.html',
  styleUrls: ['./create-issue.component.css']
})
export class CreateIssueComponent implements OnInit {

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
  imagePreview: string;
  users: any;
  allusers: any[];
  fullname: any;
  username: string;
  IssueTitle: any;
  description: any;
  status: any;
  Assignee: any;
  name:any;
  image:any;
  reporterName: any;
  IssueId: any;
  notify: boolean;
  ownuser: boolean;
  otheruser: boolean;
  addwatcher: boolean;
  editownuser: boolean;
  editotheruser: boolean;
  authToken: string;
  signuploader: boolean;
  
  constructor(public service:ServiceService,private toastr: ToastrService,public route:Router,public router:ActivatedRoute,public socketService:SocketService) { 
    this.userId=this.router.snapshot.paramMap.get('userId');
    this.username=Cookie.get('fullName');
    this.authToken=Cookie.get('authToken');
  }

  ngOnInit() {
    this.getusers();
    this.getcommentnotify(); 
    this.getaddwatchernotify();
    this.geteditnotify();
  }


  //image selection code start
public imageselect(event){
  this.file=event.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    this.imagePreview = reader.result.toString();
}
reader.readAsDataURL(this.file)
}
 //image selection code end


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


 //create Issue code start
 public createIssue=()=>{
  this.signuploader=false;
    let data={
      userId:this.userId,
      IssueTitle:this.IssueTitle,
      description:this.description,
      Image:this.file,
      name:this.file.name,
      status:this.status,
      Assignee:this.Assignee
    }
    if(!this.IssueTitle){
      this.toastr.warning('please provide Issue Title')
    }
  else if(!this.file){
      this.toastr.warning('please provide any image')
    }
   else if(!this.status){
      this.toastr.warning('please provide status of you Issue')
    }
   else if(!this.Assignee){
      this.toastr.warning('please Choose Your Assignee')
    }
    else if(!this.description){
      this.toastr.warning('please provide description')
    }
    
    else {
      this.service.createIssue(data,this.authToken).subscribe(
        data=>{
          this.signuploader=true;
          this.IssueTitle='';
          this.description='';
           this.status='';
           this.file='';
           this.Assignee='';
         this.toastr.success(data.message);
         setTimeout(() => {
           this.route.navigate(['/issue',this.userId])
         },1000);
        },
        err=>{
          this.signuploader=true;
          this.toastr.error('some error occured');
        }
      )
    }
 }
//create Issue code end


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
