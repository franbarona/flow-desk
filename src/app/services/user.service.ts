import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { customAlphabet } from 'nanoid';
import { User, UserRequest } from '../models/user.interface';
import { MOCK_USERS_DATA } from '../constants/mocks';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  users$ = new BehaviorSubject<User[]>(MOCK_USERS_DATA);

  get usersValue(): User[] {
    return this.users$.value;
  }

  getUsers(): Observable<User[]> {
    return this.users$.asObservable();
  }

  createUser(userRequest: UserRequest): Observable<User> {
    const noZeroNanoid = customAlphabet('123456789', 6); //ABCDEFGHIJKLMNOPQRSTUVWXYZ
    const newUser: User = {
      id: noZeroNanoid(),
      name: userRequest.name,
      surnames: userRequest.surnames,
      avatarUrl: userRequest.avatarUrl || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const currentUsers = this.users$.value;
    this.users$.next([...currentUsers, newUser]);

    return of(newUser);
  }

  updateUser(userId: string, updates: Partial<User>): Observable<User | null> {
    const currentUsers = this.users$.value;
    const userIndex = currentUsers.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return of(null);
    }

    const updatedUser = {
      ...currentUsers[userIndex],
      ...updates,
      updatedAt: new Date(),
    };

    const updatedUsers = [...currentUsers];
    updatedUsers[userIndex] = updatedUser;
    this.users$.next(updatedUsers);

    return of(updatedUser);
  }

  deleteUser(userId: string): Observable<boolean> {
    const currentUsers = this.users$.value;
    const userIndex = currentUsers.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return of(false); // User not founded
    }

    const updatedUsers = currentUsers.filter((user) => user.id !== userId);
    this.users$.next(updatedUsers);

    return of(true);
  }
}
