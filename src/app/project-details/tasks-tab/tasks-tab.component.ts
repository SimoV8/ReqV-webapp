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
        this.taskIsRunning = this.tasks.every(t => !t.running);
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
    this.taskService.performConsistencyCheck(this.projectId).subscribe(
      task => {
        this.tasks.unshift(new Task(task));
        this.checkRunningTask(task);
      }
    );
  }

  checkRunningTask(task: Task) {
    setTimeout(() => {
      this.taskService.getTask(this.projectId, task.id).subscribe(
        t => {
          task = new Task(t);
          if (task.running) {
            this.checkRunningTask(task);
          } else {
            const index = this.tasks.findIndex( x => x.id === task.id);
            this.tasks[index] = task;
          }
        }
      );
    }, 2500);
  }

}
