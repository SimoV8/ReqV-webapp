import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Project, ProjectType } from '../models/project';
import { ProjectService } from '../services/project.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../alert/alert.service';
import { Requirement } from '../models/requirement';

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html'
})
export class ProjectDialogComponent implements OnInit {

  projectTypes: ProjectType[];

  newProjectForm: FormGroup;

  project = new Project(null, '', '', null);

  @Output() projectCreated = new EventEmitter<Project>();

  @ViewChild('closeBtn') closeBtn: ElementRef;

  loading = false;

  constructor( private fb: FormBuilder,
               private projectService: ProjectService,
               private alertService: AlertService) {
    this.createForm();
  }

  ngOnInit() {
    this.getProjectTypes();
  }

  createForm() {
    this.newProjectForm = this.fb.group({
      name: new FormControl(this.project.name, [ Validators.required, Validators.minLength(3) ]),
      description: new FormControl(this.project.description),
      type: new FormControl(this.project.type, Validators.required)
    });
  }

  get name() { return this.newProjectForm.get('name'); }

  get description() { return this.newProjectForm.get('description'); }

  reset() {
    this.newProjectForm.reset();
    if (this.projectTypes.length > 0) {
      this.newProjectForm.get('type').setValue(this.projectTypes[0]);
    }
  }

  getProjectTypes() {
    this.projectService.getProjectTypes().subscribe( projectsTypes => {
      this.projectTypes = projectsTypes;
      if (this.projectTypes.length > 0) {
        this.newProjectForm.get('type').setValue(this.projectTypes[0]);
      }
    });
  }

  createProject() {
    this.loading = true;
    const formModel = this.newProjectForm.value;

    this.project.name = formModel.name as string;
    this.project.description = formModel.description as string;
    this.project.type = formModel.type as ProjectType;

    this.projectService.createProject(this.project).subscribe(
      response => {
        if (response.status === 200) {
          this.alertService.success('New Project created successfully');
          this.projectCreated.emit(response.body);
        } else {
          this.alertService.error('Error creating the new project');
        }
        this.closeBtn.nativeElement.click();
        this.loading = false;
      },
      error => {
        this.alertService.error('Error creating the new project');
        this.loading = false;
      }
    );
  }


}
