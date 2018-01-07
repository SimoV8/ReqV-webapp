// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProjectsComponent } from './projects/projects.component';
import { AlertComponent } from './alert/alert.component';

// Services
import { AuthenticationService } from './authentication.service';
import { AlertService } from './alert/alert.service';

// Guards
import {AuthGuard} from './auth.guard';

// Http Interceptor
import { JwtInterceptor } from './jwt.interceptor.js';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProjectsComponent,
    AlertComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    AuthenticationService,
    AuthGuard,
    AlertService,
    {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
    },
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
