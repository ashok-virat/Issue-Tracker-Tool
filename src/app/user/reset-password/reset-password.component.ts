import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TabHeadingDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  email: any;
  ResetCode: any;
  password: any;
  loader: boolean;
  sendcodeloader: boolean;
  resetpasswordloader: boolean;
  ConfirmPassword: any;

  constructor(public service:ServiceService,private toastr: ToastrService,public route:Router) { }

  ngOnInit() {
  }
  
  public sendcode=()=>{
    if(!this.email)
    {
      this.toastr.warning('Please Provide Valid Email')
    }
    else {
      this.sendcodeloader=false;
      let data={
        email:this.email
      }
      this.service.sendcode(data).subscribe(
        
        data=>{
          this.sendcodeloader=true;
          if(data.error==false){
            this.toastr.success(data.message);
            }
            else {
              this.toastr.error(data.message);
            }
        },
        err =>{
          this.sendcodeloader=true;
          this.toastr.error('some error occured')
        }
      )
    }
   
  }

  public resetpassword=()=>{
    this.resetpasswordloader=false;
    if(this.password==this.ConfirmPassword){
    let data={
      resetCode:this.ResetCode,
      password:this.password
    }
    this.service.resetpassword(data).subscribe(
      data=>{
        this.resetpasswordloader=true;
        if(data.error==false){
        this.toastr.success(data.message);
        }
        else {
          this.toastr.error(data.message);
        }
      },
      err=>{
        this.resetpasswordloader=true;
        this.toastr.error('some error occured')
      }
    )
  }
  else {
    this.toastr.error('Passwords Are Miss Macthing')
  }
}
}
