import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CreateUserRequest, User } from '../models/user.interface';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly TAGS_STORAGE_KEY = 'users';
  private readonly usersSubject = new BehaviorSubject<User[]>(this.loadUsersFromStorage());
  private readonly utilsService = inject(UtilsService);
  users$ = this.usersSubject.asObservable();

  /**
   * Get all users
   */
  getUsers(): Observable<User[]> {
    return this.users$;
  }

  /**
   * Get all users (snapshot actual)
   */
  getUsersSnapshot(): User[] {
    return this.usersSubject.value;
  }

  /**
   *Get user by ID
   */
  getUserById(id: string): User | undefined {
    return this.usersSubject.value.find((user) => user.id === id);
  }

  /**
   * Create new user
   */
  createUser(createUserRequest: CreateUserRequest): Observable<User> {
    const newUser: User = {
      id: this.utilsService.generateId(),
      name: createUserRequest.name,
      surnames: createUserRequest.surnames,
      avatarUrl: createUserRequest.avatarUrl || '',
    };

    const currentUsers = this.usersSubject.value;
    this.usersSubject.next([...currentUsers, newUser]);
    this.saveUsersToStorage();

    return of(newUser);
  }

  /**
   * Update current user
   */
  updateUser(id: string, updates: Partial<Omit<User, 'id'>>): Observable<User | undefined> {
    const currentUsers = this.usersSubject.value;
    const userIndex = currentUsers.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return of(undefined);
    }

    const updatedUser: User = {
      ...currentUsers[userIndex],
      ...updates,
    };

    const newUsers = [
      ...currentUsers.slice(0, userIndex),
      updatedUser,
      ...currentUsers.slice(userIndex + 1),
    ];

    this.usersSubject.next(newUsers);
    this.saveUsersToStorage();

    return of(updatedUser);
  }

  /**
   * Delete user
   */
  deleteUser(id: string): Observable<boolean> {
    const currentUsers = this.usersSubject.value;
    const filteredUsers = currentUsers.filter((user) => user.id !== id);

    if (filteredUsers.length === currentUsers.length) {
      return of(false); // User no encontrado
    }

    this.usersSubject.next(filteredUsers);
    this.saveUsersToStorage();

    return of(true);
  }

  /**
   * Clear all users (util for testing)
   */
  clearAll(): void {
    this.usersSubject.next([]);
    globalThis.localStorage.removeItem(this.TAGS_STORAGE_KEY);
  }

  // ============ PRIVATE METHODS ============

  private loadUsersFromStorage(): User[] {
    try {
      const stored = globalThis.localStorage?.getItem(this.TAGS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading users from storage:', error);
      return [];
    }
  }

  private saveUsersToStorage(): void {
    try {
      globalThis.localStorage.setItem(
        this.TAGS_STORAGE_KEY,
        JSON.stringify(this.usersSubject.value)
      );
    } catch (error) {
      console.error('Error saving users to storage:', error);
    }
  }

  initializeUsersSampleData(): void {
    this.createUser({ name: 'Carlos', surnames: 'Rodríguez', avatarUrl: 'users/user1.jpg' });
    this.createUser({ name: 'Leandro', surnames: 'Zurrik', avatarUrl: 'users/user6.jpg' });
    this.createUser({ name: 'Andrea', surnames: 'Martínez', avatarUrl: 'users/user3.jpg' });
    this.createUser({ name: 'Javier', surnames: 'Santos Pérez', avatarUrl: 'users/user4.jpg' });
    this.createUser({ name: 'Ana', surnames: 'Ortega', avatarUrl: 'users/user5.jpg' });
    this.createUser({ name: 'Marc', surnames: 'Dojvik', avatarUrl: 'users/user7.jpg' });
  }
}
