export enum TaskStatus {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
  RUNNING = 'RUNNING',
}

export class Task {
  id: number;
  description: string;
  projectId: number;
  type: string;
  status: TaskStatus;
  timestamp: string;
  log: string;

  constructor(task: Task) {
    this.id = task.id;
    this.description = task.description;
    this.projectId = task.projectId;
    this.type = task.type;
    this.status = task.status;
    this.timestamp = task.timestamp;
    this.log = task.log;
  }

  get success(): boolean { return this.status === TaskStatus.SUCCESS; }

  get fail(): boolean { return this.status === TaskStatus.FAIL; }

  get running(): boolean { return this.status === TaskStatus.RUNNING; }

}
