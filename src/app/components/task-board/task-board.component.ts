import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../models/user.interface';
import { Tag } from '../../models/tag.interface';
import {
  Column,
  CreateTaskRequest,
  Task,
  UpdateTaskRequest,
} from '../../models/task.interface';
import { TaskCardComponent } from '../task-card/task-card.component';
import { MOCK_COLUMNS_DATA } from '../../constants/mocks';
import { TaskService } from '../../services/task.service';
import { Subject, takeUntil } from 'rxjs';
import { ModalService } from '../../services/modal.service';
import { TaskFormComponent } from '../task-form/task-form.component';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { SharedModule } from '../shared/shared.module';
import { UserService } from '../../services/user.service';
import { TagService } from '../../services/tag.service';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss'],
  imports: [SharedModule, TaskCardComponent, TaskFormComponent],
})
export class TaskBoardComponent implements OnInit, OnDestroy {
  projectId!: string;
  tasks: Task[] = [];
  users: User[] = [];
  tags: Tag[] = [];
  columns: Column[] = MOCK_COLUMNS_DATA;
  selectedTask: Task | null = null;

  activeColumn: string | null = null;
  activeBurnBarrel: boolean = false;
  dragOverIndicator: string | null = null;
  taskPositions: Map<string, DOMRect> = new Map();
  isAnimating: boolean = false;

  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly tagService = inject(TagService);
  private readonly taskService = inject(TaskService);
  private readonly modalService = inject(ModalService);
  private readonly projectService = inject(ProjectService);
  private readonly destroy$ = new Subject<void>();

  get isModalOpen() {
    return this.modalService.isModalOpen;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const projectSlug = params['id'];
      this.projectService.getProjectsBySlug(projectSlug).subscribe((project) => {
        if (project) {
          this.projectId = project.id;
          this.loadTaskBoardData();
        }
      });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTaskBoardData(): void {
    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => (this.users = users));

    this.tagService
      .getTags()
      .pipe(takeUntil(this.destroy$))
      .subscribe((tags) => (this.tags = tags));

    this.taskService
      .getTasks(this.projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((tasks) => (this.tasks = tasks));
  }

  getFilteredTasks(column: string): Task[] {
    return this.tasks.filter((task) => task.status === column);
  }

  onDragStart(event: DragEvent, task: Task): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', task.id);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent, column?: string): void {
    event.preventDefault();
    if (column) {
      this.activeColumn = column;
      this.highlightIndicator(event, column);
    } else {
      this.activeBurnBarrel = true;
    }
  }

  onDragLeave(column?: string): void {
    if (column) {
      // Only clear if we're really leaving the column
      const target = event?.target as HTMLElement;
      const currentTarget = event?.currentTarget as HTMLElement;

      if (currentTarget && !currentTarget.contains(target)) {
        this.activeColumn = null;
        this.clearHighlights();
      }
    } else {
      this.activeBurnBarrel = false;
    }
  }

  onDrop(event: DragEvent, targetColumn?: string): void {
    event.preventDefault();
    const taskId = event.dataTransfer?.getData('text/plain');

    if (!taskId) return;

    if (targetColumn) {
      // Handle drop within column or between columns
      this.handleTaskDrop(taskId, targetColumn, event);
      this.activeColumn = null;
    } else {
      // Delete task (burn barrel)
      this.deleteTask(taskId);
      this.activeBurnBarrel = false;
    }

    this.clearHighlights();
  }

  private handleTaskDrop(taskId: string, targetColumn: string, event: DragEvent): void {
    // Capture positions before move
    this.captureTaskPositions();

    const indicators = this.getIndicators(targetColumn);
    const { element } = this.getNearestIndicator(event, indicators);
    const beforeId = element?.dataset['before'] || '-1';

    if (beforeId === taskId) return; // Can't drop on itself

    let tasksCopy = [...this.tasks];
    let taskToMove = tasksCopy.find((c) => c.id === taskId);

    if (!taskToMove) return;

    // Update task column
    taskToMove = { ...taskToMove, status: targetColumn as any };

    // Remove task from current position
    tasksCopy = tasksCopy.filter((c) => c.id !== taskId);

    if (beforeId === '-1') {
      // Drop at the end
      tasksCopy.push(taskToMove);
    } else {
      // Drop before specific task
      const insertIndex = tasksCopy.findIndex((c) => c.id === beforeId);
      if (insertIndex >= 0) {
        tasksCopy.splice(insertIndex, 0, taskToMove);
      } else {
        tasksCopy.push(taskToMove);
      }
    }

    this.tasks = tasksCopy;

    // Trigger layout animations after change
    setTimeout(() => this.animateLayoutChanges(), 0);
  }

  private captureTaskPositions(): void {
    const taskElements = document.querySelectorAll('[data-task-id]');
    taskElements.forEach((element) => {
      const taskId = element.getAttribute('data-task-id');
      if (taskId) {
        this.taskPositions.set(taskId, element.getBoundingClientRect());
      }
    });
  }

  private animateLayoutChanges(): void {
    this.isAnimating = true;
    const taskElements = document.querySelectorAll('[data-task-id]');

    taskElements.forEach((element) => {
      const taskId = element.getAttribute('data-task-id');
      if (taskId && this.taskPositions.has(taskId)) {
        const oldRect = this.taskPositions.get(taskId)!;
        const newRect = element.getBoundingClientRect();

        const deltaY = oldRect.top - newRect.top;
        const deltaX = oldRect.left - newRect.left;

        if (Math.abs(deltaY) > 1 || Math.abs(deltaX) > 1) {
          // Apply initial transform
          (element as HTMLElement).style.transform = `translate(${deltaX}px, ${deltaY}px)`;
          (element as HTMLElement).style.transition = 'none';

          // Force reflow
          element.getBoundingClientRect();

          // Animate to final position
          (element as HTMLElement).style.transition =
            'transform 300ms cubic-bezier(0.2, 0, 0.2, 1)';
          (element as HTMLElement).style.transform = 'translate(0, 0)';

          // Clean up after animation
          setTimeout(() => {
            (element as HTMLElement).style.transition = '';
            (element as HTMLElement).style.transform = '';
            this.isAnimating = false;
          }, 300);
        }
      }
    });

    this.taskPositions.clear();
  }

  private highlightIndicator(event: DragEvent, column: string): void {
    const indicators = this.getIndicators(column);
    this.clearHighlights();

    const nearest = this.getNearestIndicator(event, indicators);
    if (nearest.element) {
      nearest.element.style.opacity = '1';
      this.dragOverIndicator = nearest.element.dataset['before'] || null;
    }
  }

  private clearHighlights(): void {
    const allIndicators = document.querySelectorAll('[data-column]');
    allIndicators.forEach((indicator: Element) => {
      (indicator as HTMLElement).style.opacity = '0';
    });
    this.dragOverIndicator = null;
  }

  private getNearestIndicator(
    event: DragEvent,
    indicators: HTMLElement[]
  ): { element: HTMLElement | null; offset: number } {
    const DISTANCE_OFFSET = 25;

    return indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = event.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1] || null,
      }
    );
  }

  private getIndicators(column: string): HTMLElement[] {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`)) as HTMLElement[];
  }

  private deleteTask(taskId: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }

  closeModal() {
    this.selectedTask = null;
    this.modalService.closeModal();
  }

  /**
   * Opens modal to edit a task when clicked
   */
  openTaskModal(task: Task, event?: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.selectedTask = { ...task }; // Create a copy for editing

    // Also update the modal service if other components need to know
    this.modalService.openModal({
      users: this.users,
      tags: this.tags,
    });
  }

  /**
   * Handles creation of new tasks
   */
  onTaskCreated(taskRequest: CreateTaskRequest) {
    this.taskService
      .createTask(taskRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newTask) => {
          console.log('Task created successfully:', newTask);
          // You can add a success notification here
        },
        error: (error) => {
          console.error('Error creating task:', error);
          // You can add error handling/notification here
        },
      });
  }

  onTaskUpdated(updatedTask: UpdateTaskRequest) {
    const taskId = updatedTask.id;
    const updatedTaskData: Partial<Task> = {
      title: updatedTask.title,
      description: updatedTask.description,
      status: updatedTask.status,
      priority: updatedTask.priority,
      startDate: new Date(updatedTask.startDate),
      endDate: new Date(updatedTask.endDate),
      tags: this.tags.filter((tag) => updatedTask.tagIds.includes(tag.id)),
      assignedUsers: this.users.filter((user) => updatedTask.assignedUserIds.includes(user.id)),
    };
    this.taskService
      .updateTask(taskId, updatedTaskData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newTask) => {
          console.log('Task updated successfully:', newTask);
          // You can add a success notification here
        },
        error: (error) => {
          console.error('Error creating task:', error);
          // You can add error handling/notification here
        },
      });
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  }
}
