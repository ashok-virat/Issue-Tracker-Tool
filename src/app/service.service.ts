import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  baseurl: string;

  constructor(public http:HttpClient) {
    this.baseurl='/api/v1/users';
   }

   //signup code start
   public signup=(data):any=>{
    let params=new HttpParams()
    .set("firstName",data.firstName)
    .set("lastName",data.lastName)
    .set("email",data.email)
    .set("password",data.password)
    .set("mobileNumber",data.mobileNumber)
    let datas=this.http.post(`${this.baseurl}/signup`,params);
    return datas;
  }
  //signup code end

  //signin code start
  public signin=(data):any=>{
    let params=new HttpParams()
    .set("email",data.email)
    .set("password",data.password)
    let datas=this.http.post(`${this.baseurl}/signin`,params);
    return datas;
  }
  //signin code end

  //googlesignup code start
  public googlesignup=(data):any=>{
    let params=new HttpParams()
    .set("email",data.email)
     .set('firstName',data.firstName)
     .set("lastName",data.lastName)
     let datas=this.http.post(`${this.baseurl}/googlesignup`,params);
     return datas;
  }
  //googleisgnup code end

  //getusers code start
  public getallusers=(authToken):any=>{
    let datas=this.http.get(`${this.baseurl}/allUsers/${authToken}`);
    return datas;
  }
  //getusers code end

  //createIssue code start
  public createIssue=(data,authToken):any=>{
    let issueData=new FormData()
    issueData.append("userId",data.userId)
    issueData.append("IssueTitle",data.IssueTitle)
    issueData.append("description",data.description)
    issueData.append("Assignee",data.Assignee)
    issueData.append("status",data.status)
    issueData.append("ProductImage",data.Image,data.name)
    console.log(authToken)
    let datas=this.http.post(`${this.baseurl}/createIssue/${authToken}`,issueData);
    return datas;
  }
  //createIssue code end

  //getmyIssue code start
  public getmyIssue=(userId,authToken):any=>{
    let datas=this.http.get(`${this.baseurl}/getmyIssue/${userId}/${authToken}`);
    return datas;
  }
  //getmyIssue code end

  //getsingle Issue code start
  public getsingleIssue=(IssueId,authToken):any=>{
    let datas=this.http.get(`${this.baseurl}/getsingleIssue/${IssueId}/${authToken}`);
    return datas;
  }
  //getsingle Issue code end

  //getall Issue code start
  public getallIssue=(authToken):any=>{
    let datas=this.http.get(`${this.baseurl}/allIssues/${authToken}`);
    return datas;
  }
  //get all Issue code end

  //add comment code start
  public addcomment=(data):any=>{
    let params=new HttpParams()
    .set("IssueId",data.IssueId)
    .set("comments",data.comments)
    .set("reportername",data.reportername)
    .set('authToken',data.authToken)
    let datas=this.http.post(`${this.baseurl}/comment`,params);
    return datas;
  }
  //add comment code end

  //delete Issue code start
  public deleteIssue=(data):any=>{
   let params=new HttpParams()
   .set("IssueId",data.IssueId)
   .set("authToken",data.authToken)
   let datas=this.http.post(`${this.baseurl}/deleteIssue`,params);
   return datas;
  }
  //delete Issue code end

  //update Issue code start
  public update=(data,IssueId,authToken):any=>{
    let issueData=new FormData()
    if(data.Image){
      issueData.append("userId",data.userId)
      issueData.append("IssueTitle",data.IssueTitle)
      issueData.append("description",data.description)
      issueData.append("Assignee",data.Assignee)
      issueData.append("status",data.status)
      issueData.append("ProductImage",data.Image,data.name)
    }
    else if(!data.Image) {
      issueData.append("userId",data.userId)
      issueData.append("IssueTitle",data.IssueTitle)
      issueData.append("description",data.description)
      issueData.append("Assignee",data.Assignee)
      issueData.append("status",data.status)
      issueData.append("ProductImage",data.ProductImage)
    }
    let datas=this.http.post(`${this.baseurl}/update/${IssueId}/${authToken}`,issueData || issueData);
    return datas;
  }
  //update Issue code end

  //addwatcher code start
  public addwatcher=(data):any=>{
    let params=new HttpParams()
    .set("watcherId",data.watcherId)
    .set("receiverId",data.receiverId)
    .set("watcherName",data.watcherName)
    .set("IssueId",data.IssueId)
    .set("authToken",data.authToken)
    let datas=this.http.post(`${this.baseurl}/addwatcher`,params)
    return datas;
  }
  //addwatcher code end

//getwatcher code start
  public getwatcher=(IssueId,authToken):any=>{
    let datas=this.http.get(`${this.baseurl}/getwatcherlist/${IssueId}/${authToken}`);
    return datas;
  }
  //getwatcher code end

  //send code start
  public sendcode=(data):any=>{
   let params=new HttpParams()
   .set("email",data.email);
   let datas=this.http.post(`${this.baseurl}/resetcode`,params);
   return datas;
  }
  //send code end

  //resetpassword code start
   public resetpassword=(data):any=>{
    console.log(data);
    let params=new HttpParams()
    .set("resetId",data.resetCode)
    .set("password",data.password)
    let datas=this.http.post(`${this.baseurl}/resetpassword`,params);
    return datas;
  }
  //resetpassword code end
}
