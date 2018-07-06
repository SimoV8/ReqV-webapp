import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ProjectType, Project } from '../models/project';
import { catchError, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ProjectService {

  // URL to web api
  private projectsUrl = 'api/projects';
  private projectTypesUrl = 'api/projects/types';

  private projects: Project[];

  constructor(private http: HttpClient) { }

  /** GET project types */
  getProjectTypes(): Observable<ProjectType[]> {
    return this.http.get<ProjectType[]>(this.projectTypesUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProjectsType', [])),
      );
  }

  /** GET projects */
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.projectsUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getProjects', [])),
        tap(projects => this.projects = projects),
      );
  }

  /** GET project */
  getProject(id): Observable<Project> {

    if (this.projects != null) {
      const project = this.projects.find(prj => prj.id = id);
      if (project) {
        return of(project);
      }
    }

    return this.http.get<Project>(this.projectsUrl + '/' + id, httpOptions)
      .pipe(
        catchError(this.handleError('getProjects', null))
      );
  }

  /** POST new project */
  createProject(project: Project): Observable<HttpResponse<Project>> {
    return this.http.post<Project>(this.projectsUrl, project, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response'})
      .pipe(
        catchError(this.handleError('createProject', null))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(operation + ': ' + error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
