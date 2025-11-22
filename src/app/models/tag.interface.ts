export interface Tag {
  id: string;
  name: string;
  color?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TagRequest {
  name: string;
  color?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateTagRequest extends TagRequest {}

export interface UpdateTagRequest extends TagRequest {
  id: string;
}