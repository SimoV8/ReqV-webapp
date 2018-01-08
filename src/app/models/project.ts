export class Project {
  id: number;
  name: string;
  description: string;
  type: ProjectType;

  constructor(id: number, name: string, description: string, type: ProjectType) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.type = type;
  }

}

export class ProjectType {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

}
