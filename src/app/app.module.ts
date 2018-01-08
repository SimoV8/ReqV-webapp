// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProjectsComponent } from './projects/projects.component';
import { AlertComponent } from './alert/alert.component';
import { ProjectDialogComponent } from './project-dialog/project-dialog.component';

// Services
import { AuthenticationService } from './authentication.service';
import { AlertService } from './alert/alert.service';
import { ProjectService } from './projects/project.service';

// Guards
import {AuthGuard} from './auth.guard';

// Http Interceptor
import { JwtInterceptor } from './jwt.interceptor.js';
import { ProjectDetailsComponent } from './project-details/project-details.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AlertComponent,
    ProjectsComponent,
    ProjectDialogComponent,
    ProjectDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
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
    ProjectService,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
