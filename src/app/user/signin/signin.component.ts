import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  email: any;
  password: any;
  signuploader: boolean;
  signinloader: boolean;
  fullName: string;
  ConfirmPassword: any;

  constructor(public service:ServiceService,private toastr: ToastrService,public route:Router) { }

  ngOnInit() {
  }


  //signin code start
public signin=()=>{
  if(!this.email) {
    this.toastr.error('Please Fill The Email Field');
  }
  else if(!this.password){
    this.toastr.error('Please Fill The Password Field');
  }
  else {
 
  this.signinloader=false;
 let data={
   email:this.email,
   password:this.password
 }
 this.service.signin(data).subscribe(
   data=>{
      if(data.error==true){
        this.toastr.error(data.message);
        this.signinloader=true;
      }
      else {
        this.signinloader=true;
        this.toastr.success(data.message);
        Cookie.set('authToken',data.data.authToken);
        setTimeout(() => {
          this.fullName=`${data.data.userDetails.firstName} ${data.data.userDetails.lastName}`;
          Cookie.set('fullName',this.fullName);
          this.route.navigate(['/issue',data.data.userDetails.userId]);
        },1000);
      }
   },
   err=>{
    this.signinloader=true;
     this.toastr.error('some error occured');
   }

 )
}
}
//signin code end

}
