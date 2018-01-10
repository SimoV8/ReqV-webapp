export enum ReqState {
  VALID = 'VALID',
  INVALID = 'INVALID',
  NOT_VALIDATED = 'NOT_VALIDATED',
}

export class Requirement {
  id: number;
  text: string;
  project: number;
  errorDescription: string;
  state: ReqState;

}
