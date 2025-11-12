import { Component, OnInit } from '@angular/core';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskCreateModalComponent } from '../task-create-modal/task-create-modal.component';
import { TaskCardComponent } from '../task-card/task-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  imports: [TaskCardComponent, TaskCreateModalComponent, CommonModule],
})
export class TaskBoardComponent implements OnInit {
  tasks: Task[] = [];
  showCreateModal = false;
  TaskStatus = TaskStatus;
  taskStatusValues = Object.values(TaskStatus);
  draggedTask: Task | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  openCreateModal(): void {
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  onTaskCreated(): void {
    this.closeCreateModal();
  }

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.tasks.filter((task) => task.status === status);
  }

  onDragStart(task: Task): void {
    this.draggedTask = task;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
  }

  onDrop(status: TaskStatus): void {
    if (this.draggedTask) {
      this.taskService.updateTaskStatus(this.draggedTask.id, status);
      this.draggedTask = null;
    }
  }

  onDragEnd(): void {
    this.draggedTask = null;
  }
}
