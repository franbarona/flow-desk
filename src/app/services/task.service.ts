import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Task, User, Tag, CreateTaskRequest, EnumTaskPriority } from '../models/task.interface';
import { MOCK_TASKS_DATA, MOCK_TAGS_DATA, MOCK_USERS_DATA } from '../constants/mocks';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly tasks$ = new BehaviorSubject<Task[]>(MOCK_TASKS_DATA);
  private readonly nextId = 1;

  getTasks(): Observable<Task[]> {
    return this.tasks$.asObservable();
  }

  getUsers(): Observable<User[]> {
    return of(MOCK_USERS_DATA);
  }

  getTags(): Observable<Tag[]> {
    return of(MOCK_TAGS_DATA);
  }

  createTask(taskRequest: CreateTaskRequest): Observable<Task> {
    const assignedUsers = MOCK_USERS_DATA.filter(user => 
      taskRequest.assignedUserIds.includes(user.id)
    );
    
    const tags = MOCK_TAGS_DATA.filter(tag => 
      taskRequest.tagIds.includes(tag.id)
    );

    const newTask: Task = {
      id: this.nextId.toString(),
      title: taskRequest.title,
      description: taskRequest.description,
      column: 'todo',
      priority: EnumTaskPriority.LOW,
      startDate: new Date(taskRequest.startDate),
      endDate: new Date(taskRequest.endDate),
      assignedUsers,
      tags,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentTasks = this.tasks$.value;
    this.tasks$.next([...currentTasks, newTask]);

    return of(newTask);
  }

  deleteTask(taskId: string): Observable<boolean> {
    const currentTasks = this.tasks$.value;
    const updatedTasks = currentTasks.filter(task => task.id !== taskId);
    this.tasks$.next(updatedTasks);
    return of(true);
  }

  updateTask(taskId: string, updates: Partial<Task>): Observable<Task | null> {
    const currentTasks = this.tasks$.value;
    const taskIndex = currentTasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      return of(null);
    }

    const updatedTask = {
      ...currentTasks[taskIndex],
      ...updates,
      updatedAt: new Date()
    };

    const updatedTasks = [...currentTasks];
    updatedTasks[taskIndex] = updatedTask;
    this.tasks$.next(updatedTasks);

    return of(updatedTask);
  }
}