import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';

@Injectable()
export class TaskService {



  constructor(private http: HttpClient) { }

  public getTasks(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(this.tasksUrl(projectId));
  }

  public getTask(projectId: number, taskId: number): Observable<Task> {
    return this.http.get<Task>(this.tasksUrl(projectId, taskId.toString()));
  }

  public getTranslation(projectId: number): Observable<HttpResponse<Blob>> {
    const options = {observe: 'response' as 'response', responseType: 'blob' as 'blob'};
    return this.http.get(this.tasksUrl(projectId, 'translate'), options);
  }

  public performConsistencyCheck(projectId: number): Observable<Task> {
    return this.http.get<Task>(this.tasksUrl(projectId, 'consistencyCheck'));
  }

  public performComputeMuc(projectId: number): Observable<Task> {
    return this.http.get<Task>(this.tasksUrl(projectId, 'computeMUC'));
  }

  private tasksUrl(projectId: number, taskName = '') {
    const url = 'api/projects/{pid}/tasks/' + taskName;
    return url.replace('{pid}', projectId.toString());
  }


}
