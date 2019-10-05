import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { SigninComponent } from './user/signin/signin.component';
import { UserModule } from './user/user.module';
import {FormsModule} from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HomeModule } from './home/home.module';
import{NgxEditorModule } from 'ngx-editor';


import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
} from "angular-6-social-login";
// Configs 
export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
      [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider('1013989812468-8hdc4hvvvjorccf8e954jn5tkn3nf0m6.apps.googleusercontent.com')
        }
      ]
  );
  return config;
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule, 
    SocialLoginModule,
    ToastrModule.forRoot({
      preventDuplicates:true
    }),
    FormsModule,
    NgxEditorModule,
    UserModule,
    HomeModule,
    RouterModule.forRoot([
      {path:'signin',component:SigninComponent,pathMatch:'full'},
      {path:'',redirectTo:'signin',pathMatch:'full'},
      {path:"*",component:SigninComponent},
      {path:"**",component:SigninComponent}
    ])
  ],
  providers: [ { provide: AuthServiceConfig, useFactory: getAuthServiceConfigs }],
  bootstrap: [AppComponent]
})
export class AppModule { }
