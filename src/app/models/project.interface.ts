export interface Project {
  id: string;
  name: string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProjectRequest {
  name: string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateProjectRequest extends ProjectRequest {}

export interface UpdateProjectRequest extends ProjectRequest {
  id: string;
}
