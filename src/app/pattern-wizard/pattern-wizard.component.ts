import { Component, OnInit } from '@angular/core';
import { Item } from './item';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../models/project';
import { RequirementService } from '../services/requirement.service';
import { Requirement } from '../models/requirement';

@Component({
  selector: 'app-pattern-wizard',
  templateUrl: './pattern-wizard.component.html',
  styleUrls: ['./pattern-wizard.component.css']
})
export class PatternWizardComponent implements OnInit {

  scopes: Array<Item> = [
    new Item('Globally', 0, 'Globally', 'The pattern must always hold'),
    new Item('Before R', 1, 'Before {0}', 'The pattern must holds before the event R happens'),
    new Item('After Q', 1, 'After {0}', ''),
    new Item('Between Q and R', 2, 'Between {0} and {1}', 'The pattern must holds between events Q and R'),
    new Item('After Q until R', 2, 'After {0} until {1}', 'The patter must holds after event Q and until event R')
  ];

  patterns: Item[] = [
    new Item('Universality', 1, 'it is always the case that {0} holds',
      'This pattern describe a portion of a system\'s execution which contains only states that have a desired property.'),
    new Item( 'Absence', 1, ' it is never the case that {0} holds',
      'This pattern describes a portion of a system\'s execution that is free of certain events or states.'),
    new Item('Existence', 1, '{0} eventually holds',
      'This pattern describes a portion of a system\'s execution that contains an instance of certain events or states. '),
    new Item('Invariance', 2, 'it is always the case that if {0} holds, then {1} holds as well',
      'This pattern describes an invariance relation between two events or states.'),
    new Item('Precedence', 2, 'it is always the case that if {0} holds, then {1} previously held',
      'This pattern describes relationships between a pair of events/states P and S where the occurrence of P' +
                ' is a necessary pre-condition for an occurrence of S.'),
    new Item('PrecedenceChain12', 3,
      'it is always the case that if {0} holds and is succeeded by {1}, then {2} previously held',
      'This pattern describes relationships between an event/state as a necessary pre-condition for an occurrence' +
                ' of a chain of events/states'),
    new Item('PrecedenceChain21', 3,
      'it is always the case that if {0} holds, then {1} previously held and was preceded by {2}',
      'This pattern describes relationships between a chain of events/states as a necessary pre-condition for ' +
                'an occurrence of a event/state'),
    new Item('Response', 2, 'it is always the case that if {0} holds, then {1} eventually holds',
      'This pattern describes cause-effect relationships between a pair of events/states. An occurrence of the' +
                ' first must be followed by an occurrence of the second.'),
    new Item('ResponseChain12', 3, 'it is always the case that if {0} holds, then {1} eventually holds and is succeeded by {2}',
      'This pattern describes cause-effect relationships between events/states. An occurrence of the first ' +
                'must be followed by a chain of events/states.'),
    new Item('ResponseChain21', 3, 'it is always the case that if {0} holds and is succeeded by {1}, then {2} eventually holds after {1}',
      'This pattern describes cause-effect relationships between events/states. An occurrence of a chain of ' +
                'events/states must be followed by an occurrence of the latter state/event.'),
  ];

  selectedScope: Item = null;
  selectedPattern: Item = null;
  reqId: string = null;
  req = '';
  project = new Project(null, null, null, null);



  constructor(private route: ActivatedRoute,
              private router: Router,
              private projectService: ProjectService,
              private requirementService: RequirementService) {  }

  ngOnInit() {
    this.selectedScope = this.scopes[0];
    this.selectedPattern = this.patterns[0];
    this.getProject();
  }

  getProject() {
    const projectId = +this.route.snapshot.paramMap.get('projectId');
    this.projectService.getProject(projectId).subscribe(project => this.project = project);
  }


  selectScope(selected: Item) {
    this.selectedScope = selected;
  }

  selectPattern(selected: Item) {
    this.selectedPattern = selected;
  }

  updateReqId(event) {
    this.reqId = event.target.value;
    this.updateRequirement(null);
  }

  updateRequirement(item) {
    let reqIdLabel = '';
    if (this.reqId != null && this.reqId.length > 0) {
      reqIdLabel = '[ReqId=' + this.reqId + '] ';
    }
    this.req = reqIdLabel + this.selectedScope.text + ', ' + this.selectedPattern.text + '.';
  }

  createRequirement() {
    const requirement = new Requirement();
    requirement.text = this.req;
    requirement.project = this.project.id;
    requirement.disabled = false;
    this.requirementService.createRequirement(requirement).subscribe(req => {
      this.router.navigateByUrl('/projects/' + this.project.id);
    });
  }

}
