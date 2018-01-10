import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Requirement } from '../models/requirement';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RequirementService {

  private requirementsUrl = 'api/requirements';
  private reqFileUrl = 'api/requirements/file';


  constructor(private http: HttpClient) { }

  getRequirements(projectId: number): Observable<Requirement[]> {

    const params = new HttpParams().set('pId', projectId.toString());

    return this.http.get<Requirement[]>(this.requirementsUrl, {params: params});
  }

  uploadFile(file: File, projectId: number) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('pId', projectId.toString());

    return this.http.post(this.reqFileUrl, formData, { observe: 'response' });

  }

}
