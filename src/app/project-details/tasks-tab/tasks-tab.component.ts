import { Component, Input, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import { AlertService } from '../../alert/alert.service';
import { saveAs } from 'file-saver/FileSaver';

@Component({
  selector: 'app-tasks-tab',
  templateUrl: './tasks-tab.component.html',
  styleUrls: ['./tasks-tab.component.css']
})
export class TasksTabComponent implements OnInit {

  @Input() projectId: number;
  tasks: Task[];

  translateLoading = false;
  validateLoading = false;
  taskIsRunning = false;

  constructor(private taskService: TaskService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.getTasks();
  }

  getTasks() {
    this.taskService.getTasks(this.projectId).subscribe(
      tasks => {
        this.tasks = tasks.map(t => new Task(t));
        this.taskIsRunning = !this.tasks.every(t => !t.running);
        this.tasks.forEach(task => {
          if (task.running) {
            this.checkRunningTask(task);
          }
        });
    });
  }

  getTranslation() {
    this.translateLoading = true;
    this.taskService.getTranslation(this.projectId).subscribe(
      response => {
        const blob = new Blob([response.body], { type: 'text/plain' });
        saveAs(blob, 'output.nusmv');
        this.translateLoading = false;
      },
      error => {
        this.alertService.error(error);
        console.log(error);
        this.translateLoading = false;
      }
    );
  }

  consistencyCheck() {
    this.taskIsRunning = true;
    this.validateLoading = true;
    this.taskService.performConsistencyCheck(this.projectId).subscribe(
      task => {
        this.tasks.unshift(new Task(task));
        this.checkRunningTask(task);
        this.validateLoading = false;
      },
      error => {
        this.alertService.error(error.message);
        this.taskIsRunning = false;
        this.validateLoading = false;
      }
    );
  }

  checkRunningTask(task: Task, timeout = 2500) {
    setTimeout(() => {
      this.taskService.getTask(this.projectId, task.id).subscribe(
        response => {
          task = new Task(response);
          const index = this.tasks.findIndex( t => t.id === task.id);
          this.tasks[index] = task;
          if (task.running) {
            this.checkRunningTask(task, timeout);
          } else {
            this.taskIsRunning = false;
          }
        },
        error => {
          console.log(error);
          this.taskIsRunning = false;
        }
      );
    }, timeout);
  }

  computeMUC() {
    this.taskIsRunning = true;
    this.validateLoading = true;
    this.taskService.performFindInconsistency(this.projectId).subscribe(
      task => {
        this.tasks.unshift(new Task(task));
        this.checkRunningTask(task, 5000);
        this.validateLoading = false;
      },
      error => {
        this.alertService.error(error.message);
        this.taskIsRunning = false;
        this.validateLoading = false;
      }
    );
  }

}
