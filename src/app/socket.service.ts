import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  baseUrl: string;
  socket: any;

  constructor(public http:HttpClient) {
    this.baseUrl='http://15.206.27.155:4001';
    this.socket=io(this.baseUrl);

  }

  
      //verify and setuser code is called
      public verifyUser:any=()=>{
        let ak=Observable.create((observer)=>
        {
          this.socket.on('verifyUser',(data)=>{
            observer.next(data);
          }) 
        }) 
         return ak;
        } 
        public setUser=(userId)=>{
          this.socket.emit('set-user',userId);
        }
        //verify and setuser code is end

           //onlineuserlist code strat 
      public onlineUserList=()=>{
        let ak=Observable.create((observer)=>{
          this.socket.on('online-user-list',(result)=>{
            observer.next(result)
          })
        })
        return ak;
      }
       //onlineuserlist code end

    
       //disconnected code start
       public disconnectedSocket=()=>{
        let ak=Observable.create((observer)=>{
          this.socket.emit("disconnect",()=>{
            observer.next();
          })
        })
        return ak;
      }
      //disconnected code end

      
      //exit socket code start
     public exitsocket=()=>{
      this.socket.disconnect();
     }
      //exit socket code end


      //Issue delete code start
      public deleteIssue=(data)=>{
          this.socket.emit('Issue-Delete',data);
          
      }
      //Issue delete code end 

      //getting delete notification code start
      public gettingdeleteIssue=()=>{
        let ak=Observable.create((observer)=>{
          this.socket.on('Issue-Deleted-Notify',(data)=>{
            observer.next(data)
          })
        })
        return ak;
      }
       //getting delete notification code start

       //add-comment code start
       public addcomment=(data)=>{
       this.socket.emit('Add-Comment',data);
      }
       //add-comment code end

      //getting add comment notification code start
       public getaddcommentnotify=()=>{
        let ak=Observable.create((observer)=>{
          this.socket.on('Comment-Notify',(data)=>{
            observer.next(data)
          })
        })
        return ak;
       }
      //getting add comment notification code end

      //add-wathcers code start
      public addwatcher=(data)=>{
       this.socket.emit('Add-Watcher',data);
      }
      //add-wathcer code end

      //get add wathcer code start
      public getaddwatchertnotify=()=>{
        let ak=Observable.create((observer)=>{
          this.socket.on('Add-Watcher-Notify',(data)=>{
            observer.next(data)
          })
        })
        return ak;
       }
      //get add watcher code end

      //add edit notify code start
      public addeditnotify=(data)=>{
        this.socket.emit('Edit-Issue',data);
       }
      //add edit notify code end
     
        //get add wathcer code start
        public geteditnotify=()=>{
          let ak=Observable.create((observer)=>{
            this.socket.on('Edit-Notify',(data)=>{
              observer.next(data)
            })
          })
          return ak;
         }
        //get add watcher code end
}
