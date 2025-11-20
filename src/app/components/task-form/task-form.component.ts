import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CreateTaskRequest, Tag, Task, UpdateTaskRequest, User } from '../../models/task.interface';
import { SharedModule } from '../shared/shared.module';
import { ButtonComponent } from '../shared/button/button.component';

@Component({
  selector: 'app-task-form',
  imports: [SharedModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnChanges {
  @Input() users: User[] = [];
  @Input() tags: Tag[] = [];
  @Input() existingTask: Task | null = null; // For editing existing tasks
  @Output() taskCreated = new EventEmitter<CreateTaskRequest>();
  @Output() taskUpdated = new EventEmitter<UpdateTaskRequest>();
  @Output() modalClosed = new EventEmitter<void>();

  taskForm: FormGroup;
  selectedUsers: Set<number> = new Set();
  selectedTags: Set<number> = new Set();
  isUserDropdownOpen = false;
  isEditMode = false;
  projectOptions = [
    { value: 1, label: 'Median' },
    { value: 2, label: 'Risen' },
    { value: 3, label: 'Strata Insurance' },
  ];
  priorityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
  ];
  statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'doing', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ];

  constructor(private readonly fb: FormBuilder) {
    this.taskForm = this.createForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.existingTask) {
      this.isEditMode = true;
      this.populateFormWithTask(this.existingTask);
    } else {
      this.isEditMode = false;
      this.resetForm();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      project: [null],
      priority: ['low', [Validators.required]],
      title: ['', [Validators.required, Validators.minLength(3)]],
      status: ['todo', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  private populateFormWithTask(task: Task) {
    // Format dates for input[type="date"]
    const startDate =
      task.startDate instanceof Date
        ? task.startDate.toISOString().split('T')[0]
        : new Date(task.startDate).toISOString().split('T')[0];
    const endDate =
      task.endDate instanceof Date
        ? task.endDate.toISOString().split('T')[0]
        : new Date(task.endDate).toISOString().split('T')[0];

    this.taskForm.patchValue({
      projectId: '0',//task.project,
      priority: task.priority,
      title: task.title,
      status: task.status,
      description: task.description,
      startDate: startDate,
      endDate: endDate,
    });

    // Set selected users
    this.selectedUsers.clear();
    task.assignedUsers.forEach((user) => {
      this.selectedUsers.add(user.id);
    });

    // Set selected tags
    this.selectedTags.clear();
    task.tags.forEach((tag) => {
      this.selectedTags.add(tag.id);
    });
  }

  private resetForm() {
    this.taskForm.reset();
    this.selectedUsers.clear();
    this.selectedTags.clear();
    this.isUserDropdownOpen = false;
  }

  onSubmit() {
    if (this.taskForm.valid && this.selectedUsers.size > 0) {
      const formValue = this.taskForm.value;

      if (this.isEditMode && this.existingTask) {
        // Update existing task
        const taskRequest: UpdateTaskRequest = {
          id: this.existingTask.id,
          priority: formValue.priority,
          title: formValue.title,
          status: formValue.status,
          description: formValue.description,
          startDate: formValue.startDate,
          endDate: formValue.endDate,
          assignedUserIds: Array.from(this.selectedUsers),
          tagIds: Array.from(this.selectedTags),
        };
        this.taskUpdated.emit(taskRequest);
      } else {
        // Create new task
        const taskRequest: CreateTaskRequest = {
          priority: formValue.priority,
          title: formValue.title,
          status: formValue.status,
          description: formValue.description,
          startDate: formValue.startDate,
          endDate: formValue.endDate,
          assignedUserIds: Array.from(this.selectedUsers),
          tagIds: Array.from(this.selectedTags),
        };
        this.taskCreated.emit(taskRequest);
      }

      this.closeModal();
    }
  }

  closeModal() {
    this.resetForm();
    this.isEditMode = false;
    this.modalClosed.emit();
  }

  toggleUserSelection(userId: number) {
    if (this.selectedUsers.has(userId)) {
      this.selectedUsers.delete(userId);
    } else {
      this.selectedUsers.add(userId);
    }
  }

  toggleTagSelection(tagId: number) {
    if (this.selectedTags.has(tagId)) {
      this.selectedTags.delete(tagId);
    } else {
      this.selectedTags.add(tagId);
    }
  }

  isUserSelected(userId: number): boolean {
    return this.selectedUsers.has(userId);
  }

  isTagSelected(tagId: number): boolean {
    return this.selectedTags.has(tagId);
  }

  getSelectedUsersText(): string {
    if (this.selectedUsers.size === 0) {
      return 'Select users';
    }
    const selectedUserNames = this.users
      .filter((user) => this.selectedUsers.has(user.id))
      .map((user) => user.name);

    if (selectedUserNames.length <= 2) {
      return selectedUserNames.join(', ');
    }
    return `${selectedUserNames[0]}, ${selectedUserNames[1]} +${selectedUserNames.length - 2} more`;
  }

  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  // Validation helpers
  get projectErrors(): string | null {
    const control = this.taskForm.get('project');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Project is required';
    }
    return null;
  }

  get priorityErrors(): string | null {
    const control = this.taskForm.get('priority');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Priority is required';
    }
    return null;
  }

  get titleErrors() {
    const control = this.taskForm.get('title');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Title is required';
      if (control.errors['minlength']) return 'Title must be at least 3 characters';
    }
    return null;
  }

  get statusErrors(): string | null {
    const control = this.taskForm.get('status');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Status is required';
    }
    return null;
  }

  get descriptionErrors() {
    const control = this.taskForm.get('description');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Description is required';
      if (control.errors['minlength']) return 'Description must be at least 10 characters';
    }
    return null;
  }

  get startDateErrors() {
    const control = this.taskForm.get('startDate');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Start date is required';
    }
    return null;
  }

  get endDateErrors() {
    const control = this.taskForm.get('endDate');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'End date is required';
    }
    return null;
  }

  get isFormValid(): boolean {
    return this.taskForm.valid && this.selectedUsers.size > 0;
  }
}
