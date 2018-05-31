import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Requirement } from '../models/requirement';
import { Observable } from 'rxjs';

@Injectable()
export class RequirementService {

  private requirementsUrl = 'api/requirements';
  private reqFileUrl = 'api/requirements/file';
  private reqTranslateUrl = 'api/requirements/translate';


  constructor(private http: HttpClient) { }

  getRequirements(projectId: number): Observable<Requirement[]> {

    const params = new HttpParams().set('pId', projectId.toString());

    return this.http.get<Requirement[]>(this.requirementsUrl, {params: params});
  }

  updateRequirement(req: Requirement): Observable<Requirement> {
    return this.http.put<Requirement>(this.requirementsUrl, req);
  }

  uploadFile(file: File, projectId: number): Observable<Requirement[]> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('pId', projectId.toString());

    return this.http.post<Requirement[]>(this.reqFileUrl, formData);

  }

}
