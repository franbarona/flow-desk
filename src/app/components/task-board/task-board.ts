import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  Column,
  CreateTaskRequest,
  Tag,
  Task,
  UpdateTaskRequest,
  User,
} from '../../models/task.interface';
import { CommonModule } from '@angular/common';
import { TaskCard } from '../task-card/task-card';
import { MOCK_TASKS_DATA, MOCK_COLUMNS_DATA } from '../../constants/mocks';
import { TaskModal } from '../task-modal/task-modal';
import { TaskService } from '../../services/task.service';
import { Subject, takeUntil } from 'rxjs';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.html',
  styleUrls: ['./task-board.scss'],
  imports: [CommonModule, TaskCard, TaskModal],
})
export class TaskBoard implements OnInit, OnDestroy {
  tasks: Task[] = [];
  users: User[] = [];
  tags: Tag[] = [];
  columns: Column[] = MOCK_COLUMNS_DATA;

  isModalOpen = false;
  selectedTask: Task | null = null;

  activeColumn: string | null = null;
  activeBurnBarrel: boolean = false;
  dragOverIndicator: string | null = null;
  taskPositions: Map<string, DOMRect> = new Map();
  isAnimating: boolean = false;

  private readonly taskService = inject(TaskService);
  private readonly modalService = inject(ModalService);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Load initial data
    this.taskService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => (this.users = users));

    this.taskService
      .getTags()
      .pipe(takeUntil(this.destroy$))
      .subscribe((tags) => (this.tags = tags));

    this.taskService
      .getTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe((tasks) => (this.tasks = tasks));

    // Se suscribe a cambios del modal
    this.modalService.isModalOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isOpen) => (this.isModalOpen = isOpen));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFilteredTasks(column: string): Task[] {
    return this.tasks.filter((task) => task.column === column);
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
    taskToMove = { ...taskToMove, column: targetColumn as any };

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

  openModal() {
    this.isModalOpen = true;
  }

  
  closeModal() {
    this.isModalOpen = false;
    this.selectedTask = null;
    this.modalService.closeTaskModal();
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
    this.isModalOpen = true;

    // Also update the modal service if other components need to know
    this.modalService.openTaskModal({
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
    };
    this.taskService
      .updateTask(taskId, updatedTaskData)
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

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  }
}
