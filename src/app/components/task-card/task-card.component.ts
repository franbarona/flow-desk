import { DatePipe } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task, TaskPriority } from '../../models/task.model';
import { TaskDetailModalComponent } from '../task-detail-modal/task-detail-modal.component';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  imports: [DatePipe, TaskDetailModalComponent],
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() dragstart = new EventEmitter<void>();
  @Output() dragend = new EventEmitter<void>();

  showDetailModal = false;
  TaskPriority = TaskPriority;

  getPriorityColor(): string {
    switch (this.task.priority) {
      case TaskPriority.LOW:
        return 'text-green-600 bg-green-100';
      case TaskPriority.MEDIUM:
        return 'text-yellow-600 bg-yellow-100';
      case TaskPriority.HIGH:
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  openDetailModal(): void {
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
  }

  onDragStart(): void {
    this.dragstart.emit();
  }

  onDragEnd(): void {
    this.dragend.emit();
  }
}
