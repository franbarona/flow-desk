import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Task, TaskFormData, TaskPriority } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-task-detail-modal',
  templateUrl: './task-detail-modal.component.html',
  imports: [ CommonModule, FormsModule ]
})
export class TaskDetailModalComponent implements OnInit {
  @Input() task!: Task;
  @Output() closeTask = new EventEmitter<void>();

  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService
  ) {}

  TaskPriority = TaskPriority;
  priorityOptions = Object.values(TaskPriority);
  availableUsers: any[] = [];

  isEditing = false;
  form = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    priority: TaskPriority.MEDIUM,
    tags: [] as string[],
    assignedUsers: [] as string[]
  };

  newTag: string = '';
  formSubmitted = false;
  isSubmitting = false;
  isDeleting = false;



  ngOnInit(): void {
    this.availableUsers = this.userService.getUsers();
    this.initializeForm();
  }

  initializeForm(): void {
    this.form = {
      title: this.task.title,
      description: this.task.description,
      startDate: this.formatDateForInput(this.task.startDate),
      endDate: this.formatDateForInput(this.task.endDate),
      priority: this.task.priority,
      tags: [...this.task.tags],
      assignedUsers: this.task.assignedUsers.map(u => u.id)
    };
  }

  formatDateForInput(date: Date): string {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  closeModal(): void {
    this.closeTask.emit();
  }

  toggleEdit(): void {
    if (this.isEditing) {
      this.initializeForm();
    }
    this.isEditing = !this.isEditing;
    this.formSubmitted = false;
  }

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
      .map(userId => this.userService.getUserById(userId))
      .filter((user): user is any => user !== undefined);

    const formData: TaskFormData = {
      title: this.form.title,
      description: this.form.description,
      startDate: new Date(this.form.startDate),
      endDate: new Date(this.form.endDate),
      priority: this.form.priority,
      tags: this.form.tags,
      assignedUsers: selectedUsers
    };

    this.taskService.updateTask(this.task.id, formData);

    setTimeout(() => {
      this.isSubmitting = false;
      this.isEditing = false;
      this.formSubmitted = false;
    }, 300);
  }

  deleteTask(): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      this.isDeleting = true;
      this.taskService.deleteTask(this.task.id);
      setTimeout(() => {
        this.closeModal();
      }, 300);
    }
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

  getUserNames(): string {
    return this.task.assignedUsers.map(u => u.name).join(', ');
  }

  getDate (date: string) {
    return new Date(date)
  }
}
