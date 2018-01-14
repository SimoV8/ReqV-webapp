import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  projects: Project[];

  loading = true;

  constructor(private projectService: ProjectService) {  }

  ngOnInit() {
    this.getProjects();
  }

  getProjects() {
    this.projectService.getProjects().subscribe( projects => {
      this.projects = projects;
      this.loading = false;
    });
  }

  addProject(project: Project) {
    this.projects.push(project);
  }

}
