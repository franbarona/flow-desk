import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { TaskPriority, TaskFormData, TaskStatus } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-task-create-modal',
  templateUrl: './task-create-modal.component.html',
  imports: [CommonModule, FormsModule],
})
export class TaskCreateModalComponent implements OnInit {
  @Output() closeTask = new EventEmitter<void>();
  @Output() taskCreated = new EventEmitter<void>();

  Date = Date; // ← AGREGA ESTA LÍNEA
  TaskPriority = TaskPriority;
  priorityOptions = Object.values(TaskPriority);
  availableUsers: any[] = [];

  form = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    priority: TaskPriority.MEDIUM,
    tags: [] as string[],
    assignedUsers: [] as string[],
  };

  newTag: string = '';
  formSubmitted = false;
  isSubmitting = false;

  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.availableUsers = this.userService.getUsers();
  }

  closeModal(): void {
    this.closeTask.emit();
  }

  addTag(): void {
    if (this.newTag.trim() && !this.form.tags.includes(this.newTag.trim())) {
      this.form.tags.push(this.newTag.trim());
      this.newTag = '';
    }
  }

  removeTag(index: number): void {
    this.form.tags.splice(index, 1);
  }

  toggleUser(userId: string): void {
    const index = this.form.assignedUsers.indexOf(userId);
    if (index > -1) {
      this.form.assignedUsers.splice(index, 1);
    } else {
      this.form.assignedUsers.push(userId);
    }
  }

  isUserSelected(userId: string): boolean {
    return this.form.assignedUsers.includes(userId);
  }

  submitForm(): void {
    this.formSubmitted = true;

    if (!this.isFormValid()) {
      return;
    }

    this.isSubmitting = true;

    const selectedUsers = this.form.assignedUsers
      .map((userId) => this.userService.getUserById(userId))
      .filter((user): user is any => user !== undefined);

    const formData: TaskFormData = {
      title: this.form.title,
      description: this.form.description,
      startDate: new Date(this.form.startDate),
      endDate: new Date(this.form.endDate),
      priority: this.form.priority,
      tags: this.form.tags,
      assignedUsers: selectedUsers,
    };

    this.taskService.createTask(formData, TaskStatus.TO_DO);

    setTimeout(() => {
      this.isSubmitting = false;
      this.taskCreated.emit();
    }, 300);
  }

  isFormValid(): boolean {
    return (
      this.form.title.trim() !== '' &&
      this.form.description.trim() !== '' &&
      this.form.startDate !== '' &&
      this.form.endDate !== '' &&
      new Date(this.form.startDate) < new Date(this.form.endDate)
    );
  }

  getDateInputFormat(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getDate (date: string) {
    return new Date(date)
  }
}
