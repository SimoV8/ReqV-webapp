// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProjectsComponent } from './projects/projects.component';
import { AlertComponent } from './alert/alert.component';
import { ProjectDialogComponent } from './project-dialog/project-dialog.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { RequirementDetailsComponent } from './requirement-details/requirement-details.component';
import { RequirementsTabComponent } from './project-details/requirements-tab/requirements-tab.component';
import { TasksTabComponent } from './project-details/tasks-tab/tasks-tab.component';

// Services
import { AuthenticationService } from './services/authentication.service';
import { AlertService } from './alert/alert.service';
import { ProjectService } from './services/project.service';
import { RequirementService } from './services/requirement.service';
import { TaskService } from './services/task.service';

// Guards
import {AuthGuard} from './auth.guard';

// Http Interceptor
import { JwtInterceptor } from './jwt.interceptor.js';
import { PatternWizardComponent } from './pattern-wizard/pattern-wizard.component';
import { ExpressionWizardComponent } from './pattern-wizard/expression-wizard/expression-wizard.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AlertComponent,
    ProjectsComponent,
    ProjectDialogComponent,
    ProjectDetailsComponent,
    RequirementDetailsComponent,
    RequirementsTabComponent,
    TasksTabComponent,
    PatternWizardComponent,
    ExpressionWizardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxDatatableModule,
    NgbModule.forRoot(),
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
    RequirementService,
    TaskService,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
