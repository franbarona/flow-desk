import { Injectable } from '@angular/core';
import { User } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [
    { id: 'user-1', name: 'Juan García', email: 'juan@example.com' },
    { id: 'user-2', name: 'María López', email: 'maria@example.com' },
    { id: 'user-3', name: 'Carlos Rodríguez', email: 'carlos@example.com' },
    { id: 'user-4', name: 'Ana Martínez', email: 'ana@example.com' },
    { id: 'user-5', name: 'Luis Fernández', email: 'luis@example.com' }
  ];

  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }
}
