import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../models/project';
import { ReqState, Requirement } from '../models/requirement';
import { ProjectService } from '../services/project.service';
import { RequirementService } from '../services/requirement.service';
import { AlertService } from '../alert/alert.service';
import { errorObject } from 'rxjs/util/errorObject';


@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  projectId: number;
  project: Project;
  requirements: Requirement[];

  uploadLoading = false;
  selectedRequirement = new Requirement();

  constructor(private route: ActivatedRoute,
              private projectService: ProjectService,
              private requirementService: RequirementService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.projectId = +this.route.snapshot.paramMap.get('projectId');
    this.getProject();
    this.getRequirements();
  }

  getProject() {
    this.projectService.getProject(this.projectId).subscribe(
      project => this.project = project);
  }

  getRequirements() {
    this.requirementService.getRequirements(this.projectId).subscribe(
      requirements => this.requirements = requirements.map(req => new Requirement().clone(req)));
  }

  fileChange(event) {
    const fileList: FileList = event.target.files;

    if (fileList.length > 0) {
      this.uploadLoading = true;
      this.requirementService.uploadFile(fileList[0], this.projectId).subscribe(
        data => {
          this.uploadLoading = false;
            this.requirements = this.requirements.concat(data);
            this.alertService.success('File uploaded correctly!');
        },
        error => {
          this.alertService.error('Error uploading the file!');
          console.error(error);
          this.uploadLoading = false;
        }
      );

    }
  }

  requirementDetails(req: Requirement) {
    this.selectedRequirement = new Requirement().clone(req);
  }

  onChange(req: Requirement) {
    const index = this.requirements.findIndex(r => r.id === req.id);
    if (index >= 0) {
      this.requirements[index] = req;
    }
  }

}
