import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Requirement } from '../models/requirement';
import { Observable } from 'rxjs';

@Injectable()
export class RequirementService {

  private requirementsUrl = 'api/requirements';
  private reqFileUrl = 'api/requirements/file';


  constructor(private http: HttpClient) { }

  getRequirements(projectId: number): Observable<Requirement[]> {

    const params = new HttpParams().set('pId', projectId.toString());

    return this.http.get<Requirement[]>(this.requirementsUrl, {params: params});
  }

  createRequirement(req: Requirement): Observable<Requirement> {
    return this.http.post<Requirement>(this.requirementsUrl, req);
  }

  updateRequirement(req: Requirement): Observable<Requirement> {
    return this.http.put<Requirement>(this.requirementsUrl, req);
  }

  deleteRequirement(id: number): Observable<HttpResponse<any>> {
    return this.http.delete(this.requirementsUrl  + '/' + id, {observe: 'response'});
  }

  uploadFile(file: File, projectId: number, format: string): Observable<Requirement[]> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('pId', projectId.toString());
    formData.append('format', format);

    return this.http.post<Requirement[]>(this.reqFileUrl, formData);
  }

  exportFile(projectId: number, format: string): Observable<HttpResponse<Blob>> {
    const formData = new FormData();
    const options = {observe: 'response' as 'response',
                      responseType: 'blob' as 'blob',
                      params: {pId: projectId.toString(), format: format}};
    return this.http.get(this.reqFileUrl, options);
  }

}
