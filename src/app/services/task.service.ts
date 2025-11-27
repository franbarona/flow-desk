import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, of } from 'rxjs';
import { CreateTaskRequest, Task, PopulatedTask } from '../models/task.interface';
import { Tag } from '../models/tag.interface';
import { User } from '../models/user.interface';
import { MOCK_TASKS_DATA } from '../constants/mocks';
import { EnumPriorities, EnumStatus } from '../constants/constants';
import { TagService } from './tag.service';
import { UtilsService } from './utils.service';
import { ProjectService } from './project.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly TASKS_STORAGE_KEY = 'tasks';
  private readonly tasksSubject = new BehaviorSubject<Task[]>(this.loadTasksFromStorage());
  private readonly projectService = inject(ProjectService);
  private readonly tagService = inject(TagService);
  private readonly userService = inject(UserService);
  private readonly utilsService = inject(UtilsService);
  tasks$ = this.tasksSubject.asObservable();
  populatedTask$: Observable<PopulatedTask[]>;

  constructor() {
    this.populatedTask$ = this.createEnrichedTasksObservable();
  }

  /**
   * Get all tasks
   */
  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  /**
   * Get task by id
   */
  getTaskById(id: string): Task | undefined {
    return this.tasksSubject.value.find((task) => task.id === id);
  }

  /**
   * Get populated tasks by projectId
   */
  getTasksByProjectId(projectId: string): Observable<PopulatedTask[]> {
    return this.populatedTask$.pipe(
      map((tasks) => tasks.filter((task) => task.projectId === projectId))
    );
  }

  /**
   * Create task
   */
  createTask(createTaskRequest: CreateTaskRequest): Observable<Task> {
    const newTask: Task = {
      id: this.utilsService.generateId(),
      projectId: createTaskRequest.projectId,
      title: createTaskRequest.title,
      description: createTaskRequest.description,
      status: createTaskRequest.status,
      priority: createTaskRequest.priority,
      startDate: new Date(),
      endDate: new Date(),
      tagIds: createTaskRequest.tagIds,
      assignedUserIds: createTaskRequest.assignedUserIds,
    };

    const currentTasks = this.tasksSubject.value;
    this.tasksSubject.next([...currentTasks, newTask]);
    this.saveTasksToStorage();
    return of(newTask);
  }

  /**
   * Update task
   */
  updateTask(id: string, updates: Partial<Omit<Task, 'id'>>): Observable<Task | undefined> {
    const currentTasks = this.tasksSubject.value;
    const taskIndex = currentTasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
      return of(undefined);
    }

    const updatedTask: Task = {
      ...currentTasks[taskIndex],
      ...updates,
    };

    const newTasks = [
      ...currentTasks.slice(0, taskIndex),
      updatedTask,
      ...currentTasks.slice(taskIndex + 1),
    ];

    this.tasksSubject.next(newTasks);
    this.saveTasksToStorage();

    return of(updatedTask);
  }

  /**
   * Update task
   */
  updateTaskStatus(id: string, status: EnumStatus): Observable<Task | undefined> {
    const currentTasks = this.tasksSubject.value;
    const taskIndex = currentTasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
      return of(undefined);
    }

    const updatedTask: Task = {
      ...currentTasks[taskIndex],
      status: status,
    };

    const newTasks = [
      ...currentTasks.slice(0, taskIndex),
      updatedTask,
      ...currentTasks.slice(taskIndex + 1),
    ];

    this.tasksSubject.next(newTasks);
    this.saveTasksToStorage();

    return of(updatedTask);
  }

  /**
   * Delete task
   */
  deleteTask(id: string): Observable<boolean> {
    const currentTasks = this.tasksSubject.value;
    const filteredTasks = currentTasks.filter((task) => task.id !== id);

    if (filteredTasks.length === currentTasks.length) {
      return of(false); // Task no encontrada
    }

    this.tasksSubject.next(filteredTasks);
    this.saveTasksToStorage();

    return of(true);
  }

  /**
   * Fill task with tags data objects
   */
  enrichTasksWithTags(tasks: Task[]): PopulatedTask[] {
    const tags = this.tagService.getTagsSnapshot();
    const tagMap = new Map(tags.map((tag) => [tag.id, tag]));
    const users = this.userService.getUsersSnapshot();
    const userMap = new Map(users.map((user) => [user.id, user]));

    return tasks.map((task) => ({
      ...task,
      tags: task.tagIds.map((id) => tagMap.get(id)).filter((tag): tag is Tag => tag !== undefined),
      assignedUsers: task.assignedUserIds
        .map((id) => userMap.get(id))
        .filter((user): user is User => user !== undefined),
    }));
  }

  /**
   * Clear all tasks (util for testing)
   */
  clearAll(): void {
    this.tasksSubject.next([]);
    globalThis.localStorage.removeItem(this.TASKS_STORAGE_KEY);
  }

  // ============ PRIVATE METHODS ============
  private createEnrichedTasksObservable(): Observable<PopulatedTask[]> {
    return combineLatest([this.tasks$, this.tagService.tags$, this.userService.users$]).pipe(
      map(([tasks]) => this.enrichTasksWithTags(tasks))
    );
  }

  private loadTasksFromStorage(): Task[] {
    try {
      const stored = globalThis.localStorage?.getItem(this.TASKS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading tasks from storage:', error);
      return [];
    }
  }

  private saveTasksToStorage(): void {
    try {
      globalThis.localStorage.setItem(
        this.TASKS_STORAGE_KEY,
        JSON.stringify(this.tasksSubject.value)
      );
    } catch (error) {
      console.error('Error saving tasks to storage:', error);
    }
  }

  initializeTasksSampleData(): void {
    // Get projects created by TagService
    const projects = this.projectService.getProjectsSnapshot();
    const projectIds = projects.map((project) => project.id);

    // Get tags created by TagService
    const tags = this.tagService.getTagsSnapshot();
    const tagIds = tags.map((tag) => tag.id);

    // Get tags created by TagService
    const users = this.userService.getUsersSnapshot();
    const userIds = users.map((user) => user.id);

    for (const task of MOCK_TASKS_DATA) {
      //Get random project
      const randomProjectId = projectIds[Math.floor(Math.random() * projectIds.length)];

      // Get random tags
      const assignedTagIds: string[] = [];
      for (let i = 0; i < Math.floor(Math.random() * 6 + 1); i++) {
        const randomTagId = tagIds[Math.floor(Math.random() * tagIds.length)];
        if (!assignedTagIds.includes(randomTagId)) {
          assignedTagIds.push(randomTagId);
        }
      }

      // Get random users
      const assignedUserIds: string[] = [];
      for (let i = 0; i < Math.floor(Math.random() * 6 + 1); i++) {
        const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
        if (!assignedUserIds.includes(randomUserId)) {
          assignedUserIds.push(randomUserId);
        }
      }

      // Get random priority
      const priorityValues = Object.values(EnumPriorities);
      const randomPriorityIndex =
        Math.floor(Math.random() * Object.keys(EnumPriorities).length);
      const randomPriority = priorityValues[randomPriorityIndex];

      // Get random status
      const statusValues = Object.values(EnumStatus);
      const randomStatusIndex = Math.floor(Math.random() * Object.keys(EnumStatus).length);
      const randomStatus = statusValues[randomStatusIndex];

      //Get random dates
      const { pastDate, futureDate } = this.utilsService.generateRandomDates();

      this.createTask({
        projectId: randomProjectId,
        priority: randomPriority,
        title: task.title,
        description: task.description,
        startDate: pastDate.toDateString(),
        endDate: futureDate.toDateString(),
        status: randomStatus,
        tagIds: assignedTagIds,
        assignedUserIds: assignedUserIds,
      });
    }
  }
}
