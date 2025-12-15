import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { User } from '../../models/user.interface';
import { Tag } from '../../models/tag.interface';
import { Column, PopulatedTask, UpdateTaskStatusRequest } from '../../models/task.interface';
import { TaskCardComponent } from '../task-card/task-card.component';
import { Subject } from 'rxjs';
import { SharedModule } from '../shared/shared.module';
import { EnumStatus, TASK_BOARD_COLUMNS_DATA } from '../../constants/constants';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss'],
  imports: [SharedModule, TaskCardComponent],
})
export class TaskBoardComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();

  @Input() projectId!: string;
  @Input() tasks: PopulatedTask[] = [];
  @Input() users: User[] = [];
  @Input() tags: Tag[] = [];
  columns: Column[] = TASK_BOARD_COLUMNS_DATA;
  activeColumn: string | null = null;
  activeDeleteForever: boolean = false;
  dragOverIndicator: string | null = null;
  taskPositions: Map<string, DOMRect> = new Map();
  isAnimating: boolean = false;

  @Output() editTask = new EventEmitter<PopulatedTask>();
  @Output() updateTaskStatus = new EventEmitter<UpdateTaskStatusRequest>();
  @Output() deleteTask = new EventEmitter<PopulatedTask>();

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFilteredTasks(column: string): PopulatedTask[] {
    return this.tasks.filter((task) => task.status === column);
  }

  onDragStart(event: DragEvent, task: PopulatedTask): void {
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
      this.activeDeleteForever = true;
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
      this.activeDeleteForever = false;
    }
  }

  onDrop(event: DragEvent, targetColumn?: EnumStatus): void {
    event.preventDefault();
    const taskId = event.dataTransfer?.getData('text/plain');

    if (!taskId) return;
    const selectedTask = this.tasks.find((task) => task.id === taskId);
    if (!selectedTask) return;

    if (targetColumn) {
      // Handle drop within column or between columns
      this.handleTaskDrop(taskId, targetColumn, event);
      this.updateTaskStatus.emit({id: taskId, status: targetColumn});
      this.activeColumn = null;
    } else {
      // Delete task (burn barrel)
      this.deleteTask.emit(selectedTask);
      this.activeDeleteForever = false;
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

  trackByTaskId(index: number, task: PopulatedTask): string {
    return task.id;
  }

  /**
   * Opens modal to edit a task when clicked
   */
  openTaskModal(task: PopulatedTask, event?: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.editTask.emit({ ...task });
  }
}
