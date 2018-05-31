import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Requirement } from '../../models/requirement';
import { RequirementService } from '../../services/requirement.service';
import { AlertService } from '../../alert/alert.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-requirements-tab',
  templateUrl: './requirements-tab.component.html',
  styleUrls: ['./requirements-tab.component.css' ]
})
export class RequirementsTabComponent implements OnInit {

  @Input() projectId: number;

  requirements: Requirement[];
  selectedRequirement = new Requirement();

  uploadLoading = false;
  progressMessage = 'Loading...';

  searchValue = '';

  rows = [];
  selected = [];

  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(private requirementService: RequirementService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.getRequirements();
  }

  requirementDetails(event) {
    if (event.type === 'dblclick') {
      this.selectedRequirement = new Requirement().clone(event.row);
    }
  }

  onChange(req: Requirement) {
    const index = this.requirements.findIndex(r => r.id === req.id);
    if (index >= 0) {
      this.requirements[index] = req;
    }

    this.updateFilter(null);
  }

  getRequirements() {
    this.requirementService.getRequirements(this.projectId).subscribe(
      requirements => {
        this.requirements = requirements.map(req => new Requirement().clone(req));
        this.rows = this.requirements;
      });
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

  }

  updateFilter(event) {
    const val = this.searchValue.toLowerCase();

    // filter our data
    const temp = this.requirements.filter(function(req) {
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
