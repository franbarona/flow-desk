import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task, TaskStatus, TaskPriority, TaskFormData, User } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly tasks$ = new BehaviorSubject<Task[]>(this.initializeMockTasks());
  private nextId = 4;

  constructor() {
    this.loadTasks();
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$.asObservable();
  }

  getTasksByStatus(status: TaskStatus): Observable<Task[]> {
    return new Observable((observer) => {
      this.tasks$.subscribe((tasks) => {
        observer.next(tasks.filter((task) => task.status === status));
      });
    });
  }

  createTask(formData: TaskFormData, status: TaskStatus = TaskStatus.TO_DO): void {
    const currentTasks = this.tasks$.getValue();
    const newTask: Task = {
      id: this.generateId(),
      ...formData,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks$.next([...currentTasks, newTask]);
    this.saveTasks();
  }

  updateTask(id: string, formData: TaskFormData): void {
    const currentTasks = this.tasks$.getValue();
    const taskIndex = currentTasks.findIndex((task) => task.id === id);

    if (taskIndex !== -1) {
      currentTasks[taskIndex] = {
        ...currentTasks[taskIndex],
        ...formData,
        updatedAt: new Date(),
      };
      this.tasks$.next([...currentTasks]);
      this.saveTasks();
    }
  }

  updateTaskStatus(id: string, status: TaskStatus): void {
    const currentTasks = this.tasks$.getValue();
    const taskIndex = currentTasks.findIndex((task) => task.id === id);

    if (taskIndex !== -1) {
      currentTasks[taskIndex].status = status;
      currentTasks[taskIndex].updatedAt = new Date();
      this.tasks$.next([...currentTasks]);
      this.saveTasks();
    }
  }

  deleteTask(id: string): void {
    const currentTasks = this.tasks$.getValue();
    const filteredTasks = currentTasks.filter((task) => task.id !== id);
    this.tasks$.next(filteredTasks);
    this.saveTasks();
  }

  private generateId(): string {
    return `task-${this.nextId++}`;
  }

  private initializeMockTasks(): Task[] {
    return [
      {
        id: 'task-1',
        title: 'Diseñar página de inicio',
        description: 'Crear el diseño mockup de la página de inicio',
        startDate: new Date(2025, 10, 5),
        endDate: new Date(2025, 10, 12),
        priority: TaskPriority.HIGH,
        status: TaskStatus.IN_PROGRESS,
        tags: ['diseño', 'frontend'],
        assignedUsers: [{ id: 'user-1', name: 'Juan García' }],
        createdAt: new Date(2025, 10, 1),
        updatedAt: new Date(2025, 10, 1),
      },
      {
        id: 'task-2',
        title: 'Configurar base de datos',
        description: 'Configurar MongoDB para el proyecto',
        startDate: new Date(2025, 10, 8),
        endDate: new Date(2025, 10, 15),
        priority: TaskPriority.HIGH,
        status: TaskStatus.TO_DO,
        tags: ['backend', 'base de datos'],
        assignedUsers: [
          { id: 'user-2', name: 'María López' },
          { id: 'user-3', name: 'Carlos Rodríguez' },
        ],
        createdAt: new Date(2025, 10, 1),
        updatedAt: new Date(2025, 10, 1),
      },
      {
        id: 'task-3',
        title: 'Revisar código',
        description: 'Hacer code review de los componentes Angular',
        startDate: new Date(2025, 9, 28),
        endDate: new Date(2025, 10, 5),
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.DONE,
        tags: ['code review', 'calidad'],
        assignedUsers: [{ id: 'user-1', name: 'Juan García' }],
        createdAt: new Date(2025, 9, 25),
        updatedAt: new Date(2025, 10, 3),
      },
    ];
  }

  private saveTasks(): void {
    const tasks = this.tasks$.getValue();
    if (typeof localStorage !== 'undefined') {
      // ← AGREGA ESTA VALIDACIÓN
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }

  private loadTasks(): void {
    if (typeof localStorage === 'undefined') {
      // ← AGREGA ESTA VALIDACIÓN
      return;
    }
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const tasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          startDate: new Date(task.startDate),
          endDate: new Date(task.endDate),
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        }));
        this.tasks$.next(tasks);
        const maxId = Math.max(...tasks.map((t: Task) => Number.parseInt(t.id.split('-')[1], 10)), 0);
        this.nextId = maxId + 1;
      } catch {
        console.error('Error loading tasks from localStorage');
      }
    }
  }
}
