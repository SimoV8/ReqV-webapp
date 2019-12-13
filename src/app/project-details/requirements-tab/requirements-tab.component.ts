import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Requirement } from '../../models/requirement';
import { RequirementService } from '../../services/requirement.service';
import { AlertService } from '../../alert/alert.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import {Project} from '../../models/project';

@Component({
  selector: 'app-requirements-tab',
  templateUrl: './requirements-tab.component.html',
  styleUrls: ['./requirements-tab.component.css' ]
})
export class RequirementsTabComponent implements OnInit {

  _project: Project;
  selectedRequirement = new Requirement();

  uploadLoading = false;
  progressMessage = 'Loading...';

  searchValue = '';

  rows = [];
  selected: Requirement[] = [];

  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(private requirementService: RequirementService,
              private alertService: AlertService) { }

  ngOnInit() {
  }

  @Input()
  set project(val: Project) {
    if (val != null) {
      this._project = val;
      this.getRequirements();
    }
  }

  requirementDetails(event) {
    if (event.type === 'dblclick') {
      this.selectedRequirement = new Requirement().clone(event.row);
    }
  }

  onChange(req: Requirement) {
    const index = this._project.requirements.findIndex(r => r.id === req.id);
    if (index >= 0) {
      this._project.requirements[index] = req;
    }

    this.updateFilter(null);
  }

  getRequirements() {
    this.requirementService.getRequirements(this._project.id).subscribe(
      requirements => {
        this._project.requirements = requirements.map(req => new Requirement().clone(req));
        this.rows = this._project.requirements;
      });
  }

  getRowClass(req) {
    return {
      'row-green': req.compliant,
      'row-red': req.error,
      'row-yellow': req.waning,
      'row-disabled': req.disabled
    };
  }

  disableSelected(disabled: boolean) {
    this.uploadLoading = true;
    const reqs = this.selected;
    let loaded = 0;
    reqs.forEach(req => {
      req.disabled = disabled;
      this.requirementService.updateRequirement(req).subscribe(
        data => {
          loaded++;
          if (loaded === reqs.length) {
            this.uploadLoading = false;
            this.onChange(new Requirement().clone(data));
          }
        },
        error => { this.alertService.error(error); });
    });
  }

  deleteSelected() {
    this.uploadLoading = true;
    const reqs = this.selected;
    let loaded = 0;
    reqs.forEach(req => {
      this.requirementService.deleteRequirement(req.id).subscribe(
        response => {
          const index = this._project.requirements.findIndex(r => r.id === req.id);
          if (index >= 0) {
            this._project.requirements.splice(index, 1);
          }
          loaded++;
          if (loaded === reqs.length) {
            this.uploadLoading = false;
            this.updateFilter(null);
          }
        },
        error => {
          this.alertService.error(error);
        });
    });
  }

  updateFilter(event) {
    const val = this.searchValue.toLowerCase();

    // filter our data
    const temp = this._project.requirements.filter(function(req) {
      return req.text.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;

    if (event != null) {
      // Whenever the filter changes, always go back to the first page
      this.table.offset = 0;
    }

    // Remove previously selected items
    this.selected = [];

  }


}
