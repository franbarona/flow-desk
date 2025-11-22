export interface User {
  id: string;
  name: string;
  surnames: string;
  avatarUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserRequest {
  name: string;
  surnames: string;
  avatarUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUserRequest extends UserRequest {}

export interface UpdateUserRequest extends UserRequest {
  id: string;
}
