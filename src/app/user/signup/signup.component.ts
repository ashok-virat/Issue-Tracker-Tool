import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {
  AuthService,
  GoogleLoginProvider
} from 'angular-6-social-login';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  
  lastName: any;
  mobileNumber: any;
  email: any;
  password: any;
  signuploader: boolean;
  fullname: string[];
  username: string;
  firstName: any;
  ConfirmPassword: any;

  constructor(public service:ServiceService,private toastr: ToastrService,public route:Router,public socialAuthService: AuthService) { }

  ngOnInit() {
    
  }

  //signup code start
  public signup=()=>{
    if(!this.email){
      this.toastr.error('Please Fill The Email Field');
    }
    else if(!this.password){
      this.toastr.error('Please Fill The Password Field');
    }
    else if(!this.mobileNumber){
      this.toastr.error('Please Fill The  MobileNumber Field');
    }
    else if(!this.firstName){
      this.toastr.error('Plaese Fill The First Name Field');
    }
    else if(!this.lastName){
      this.toastr.error('Please Fill The Last Name Field');
    }
    else if(!this.ConfirmPassword){
      this.toastr.error('Please Fill The Confirm Password Field');
    }
    else {
    if(this.password==this.ConfirmPassword){
    this.signuploader=false;
    let data={
      firstName:this.firstName,
      lastName:this.lastName,
      mobileNumber:this.mobileNumber,
      email:this.email,
      password:this.password
    }
    this.service.signup(data).subscribe(
      data=>{
        if(data.error==true){
          this.toastr.error(data.message);
          this.signuploader=true;
        
        }
        else {
          this.signuploader=true;
          this.toastr.success(data.message);
          setTimeout(() => {
            this.route.navigate(['/signin']);
          },2000);
        }
      },
      err=>{
        this.signuploader=true;
         this.toastr.error('some error occured');
      }
    )
    }
    else {
      this.toastr.error('Passwors Are Miss Matching');
    }
  }
  }
   //signup code end

   //function for Social platform signin using Google account
   public socialSignIn(socialPlatform : string) {
    let socialPlatformProvider;
     if(socialPlatform == "google"){
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    } 
    
    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
       this.fullname=userData.name.split(' ');
    let data={
      email:userData.email,
      firstName:this.fullname[0],
      lastName:this.fullname[1]
    }
    this.service.googlesignup(data).subscribe(
      data=>{
        this.toastr.success(data.message);
        setTimeout(() => {
          Cookie.set('authToken',data.data.authToken);
          this.username=`${data.data.userDetails.firstName} ${data.data.userDetails.lastName}`;
          Cookie.set('fullName',this.username);
          this.route.navigate(['/issue',data.data.userDetails.userId]);
        },1000);
      }
      
    )
          },(err)=>{
            this.toastr.error('some error occured');
          });
    
  }
  fullName(arg0: string, fullName: any) {
    throw new Error("Method not implemented.");
  }
//End of social platform signin function
}
