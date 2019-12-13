import {Component, Input, OnInit, OnChanges} from '@angular/core';
import {Project} from '../../models/project';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {ProjectService} from '../../services/project.service';
import {AlertService} from '../../alert/alert.service';
import {Requirement} from '../../models/requirement';
import {RequirementService} from '../../services/requirement.service';

import { saveAs } from 'file-saver/FileSaver';

@Component({
  selector: 'app-settings-tab',
  templateUrl: './settings-tab.component.html',
  styleUrls: ['./settings-tab.component.css']
})
export class SettingsTabComponent implements OnInit, OnChanges {

  @Input() project: Project;
  editProjectForm: FormGroup;

  loading: boolean;
  uploadLoading: boolean;
  downloadLoading: boolean;

  importChoices = [{label: 'Text', value: 'text'}, {label: 'CSV', value: 'csv'}];
  exportChoices = [{label: 'Text', value: 'text'}, {label: 'CSV', value: 'csv'}, {label: 'NuSMV specification', value: 'nusmv'}, {label: 'Aalta specification', value: 'aalta'}];
  importType = this.importChoices[0].value;
  exportType = this.exportChoices[0].value;

  constructor( private fb: FormBuilder,
               private projectService: ProjectService,
               private requirementService: RequirementService,
               private alertService: AlertService) {
    this.editProjectForm = new FormGroup({
      'name': new FormControl('', [ Validators.required, Validators.minLength(3) ]),
      'description': new FormControl('', []),
    });
  }

  ngOnInit() {  }

  get name() { return this.editProjectForm.get('name'); }

  ngOnChanges(changes) {
    if (this.project != null) {
      this.editProjectForm.get('name').setValue(this.project.name);
      this.editProjectForm.get('description').setValue(this.project.description);
    }
  }

  editProject() {
    this.loading = true;
    const formModel = this.editProjectForm.value;

    const prj = new Project(this.project.id, formModel.name as string, formModel.description as string, this.project.type);

    this.projectService.editProject(prj).subscribe(
      response => {
        if (response.status === 200) {
          this.alertService.success('Project edited successfully');
          this.project.name = response.body.name;
          this.project.description = response.body.description;
        } else {
          this.alertService.error('Error occurred while editing the project');
        }
        this.loading = false;
      },
      error => {
        this.alertService.error('Error occurred while editing the project');
        this.loading = false;
      }
    );
  }

  fileChange(event) {
    const fileList: FileList = event.target.files;

    if (fileList.length > 0) {
      this.uploadLoading = true;
      this.requirementService.uploadFile(fileList[0], this.project.id, this.importType).subscribe(
        data => {
          this.uploadLoading = false;
          this.project.requirements.concat(data.map(req => new Requirement().clone(req)));
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

  exportFile() {
    this.downloadLoading = true;
    this.requirementService.exportFile(this.project.id, this.exportType).subscribe(
      response => {
        const blob = new Blob([response.body], { type: 'text/plain' });
        const extention = this.getFileExtension(response.headers.get('Content-Description'));
        saveAs(blob, this.project.name + extention);
        this.downloadLoading = false;
      },
      error => {
        this.alertService.error(error.message);
        console.log(error);
        this.downloadLoading = false;
      }
    );
  }

  getFileExtension(format: string): string {
    console.log(format);
    switch (format) {
      case 'text':
        if (this.project.type === 'PSP') {
          return '.req';
        } else {
          return '.ltl';
        }
      case 'nusmv':
        return '.smv';
      case 'aalta':
        return '.ltl';
      case 'csv':
        return '.csv';
      default:
        return '';
    }
  }

}
