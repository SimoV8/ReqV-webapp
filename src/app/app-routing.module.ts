import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {ProjectsComponent} from './projects/projects.component';
import {AuthGuard} from './auth.guard';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { PatternWizardComponent } from './pattern-wizard/pattern-wizard.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'projects', component: ProjectsComponent, canActivate: [AuthGuard] },
  { path: 'projects/:projectId', component: ProjectDetailsComponent, canActivate: [AuthGuard]},
  { path: 'projects/:projectId/addReq', component: PatternWizardComponent, canActivate: [AuthGuard]},

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
})
export class AppRoutingModule { }
