export enum ReqState {
  COMPLIANT = 'COMPLIANT',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  NOT_CHECKED = 'NOT_CHECKED'
}

export class Requirement {
  id: number;
  text: string;
  project: number;
  errorDescription: string;
  state: ReqState;

  clone(req: Requirement): Requirement {
    this.id = req.id;
    this.text = req.text;
    this.project = req.project;
    this.errorDescription = req.errorDescription;
    this.state = req.state;
    return this;
  }

  get compliant(): boolean { return this.state === ReqState.COMPLIANT; }

  get warning(): boolean { return this.state === ReqState.WARNING; }

  get error(): boolean { return this.state === ReqState.ERROR; }

  get notChecked(): boolean { return this.state === ReqState.NOT_CHECKED; }

}
