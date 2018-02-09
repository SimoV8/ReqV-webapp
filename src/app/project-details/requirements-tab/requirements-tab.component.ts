import { Component, Input, OnInit } from '@angular/core';
import { Requirement } from '../../models/requirement';
import { ActivatedRoute } from '@angular/router';
import { RequirementService } from '../../services/requirement.service';
import { AlertService } from '../../alert/alert.service';

@Component({
  selector: 'app-requirements-tab',
  templateUrl: './requirements-tab.component.html',
  styleUrls: ['./requirements-tab.component.css']
})
export class RequirementsTabComponent implements OnInit {

  @Input() projectId: number;

  requirements: Requirement[];
  selectedRequirement = new Requirement();

  uploadLoading = false;

  constructor(private requirementService: RequirementService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.getRequirements();
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
          this.requirements = this.requirements.concat(data.map(req => new Requirement().clone(req)));
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

}
