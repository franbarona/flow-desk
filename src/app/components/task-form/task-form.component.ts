import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/user.interface';
import { Tag } from '../../models/tag.interface';
import { CreateTaskRequest, PopulatedTask, UpdateTaskRequest } from '../../models/task.interface';
import { SharedModule } from '../shared/shared.module';
import { ButtonComponent } from '../shared/button/button.component';
import { first, zip } from 'rxjs';
import { DropdownOptions, MultiselectDropdown } from '../../models/utils.interface';
import { ProjectService } from '../../services/project.service';
import { UtilsService } from '../../services/utils.service';
import { EnumPriorities, EnumStatus } from '../../constants/mocks';

@Component({
  selector: 'app-task-form',
  imports: [SharedModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnInit, OnChanges {
  @Input() projectId!: string;
  @Input() users: User[] = [];
  @Input() tags: Tag[] = [];
  @Input() existingTask: PopulatedTask | null = null; // For editing existing tasks
  @Output() taskCreated = new EventEmitter<CreateTaskRequest>();
  @Output() taskUpdated = new EventEmitter<UpdateTaskRequest>();
  @Output() modalClosed = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly projectService = inject(ProjectService);
  private readonly utilsService = inject(UtilsService);

  taskForm: FormGroup;
  selectedTags: Set<string> = new Set();
  // selectedUsers: Set<string> = new Set();
  isUserDropdownOpen = false;
  isEditMode = false;
  projectOptions: DropdownOptions[] = [];
  priorityOptions: DropdownOptions[] = [];
  statusOptions: DropdownOptions[] = [];

  assignableUsers: MultiselectDropdown[] = [];

  constructor() {
    this.taskForm = this.createForm();
  }

  ngOnInit() {
    for (const user of this.users) {
      this.assignableUsers.push({
        id: user.id,
        label: user.name,
        extraLabel: user.surnames,
        avatarUrl: user.avatarUrl,
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.existingTask) {
      this.isEditMode = true;
      this.loadMasterData();
      this.populateFormWithTask(this.existingTask);
    } else {
      this.isEditMode = false;
      this.resetForm();
    }
  }

  loadMasterData() {
    zip(
      this.projectService.getProjectOptions(),
      this.utilsService.getPriorityOptions(),
      this.utilsService.getStatusOptions()
    )
      .pipe(first())
      .subscribe(([projects, priorityOptions, statusOptions]) => {
        this.projectOptions = projects;
        this.priorityOptions = priorityOptions;
        this.statusOptions = statusOptions;
      });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      project: [null],
      priority: [EnumPriorities.LOW, [Validators.required]],
      title: ['', [Validators.required, Validators.minLength(3)]],
      status: [EnumStatus.TODO, [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      users: [[], Validators.required],
    });
  }

  private populateFormWithTask(task: PopulatedTask) {
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
      project: task.projectId,
      priority: task.priority,
      title: task.title,
      status: task.status,
      description: task.description,
      startDate: startDate,
      endDate: endDate,
      users: task.assignedUserIds
    });

    // Set selected tags
    this.selectedTags.clear();
    task.tags.forEach((tag) => {
      this.selectedTags.add(tag.id);
    });

    // Set selected users
    // this.selectedUsers.clear();
    // task.assignedUsers.forEach((user) => {
    //   this.selectedUsers.add(user.id);
    // });
    // this.assignableUsers = [];
    // for (const user of task.assignedUsers) {
    //   this.assignableUsers.push({
    //     id: user.id,
    //     label: user.name,
    //     extraLabel: user.surnames,
    //     avatarUrl: user.avatarUrl
    //   })
    // }
  }

  private resetForm() {
    this.taskForm.reset();
    this.assignableUsers = [];
    this.selectedTags.clear();
    this.isUserDropdownOpen = false;
  }

  onSubmit() {
    if (this.taskForm.valid && this.assignableUsers.length > 0) {
      const formValue = this.taskForm.value;

      if (this.isEditMode && this.existingTask) {
        // Update existing task
        const taskRequest: UpdateTaskRequest = {
          id: this.existingTask.id,
          projectId: formValue.project,
          priority: formValue.priority,
          title: formValue.title,
          status: formValue.status,
          description: formValue.description,
          startDate: formValue.startDate,
          endDate: formValue.endDate,
          tagIds: Array.from(this.selectedTags),
          assignedUserIds: formValue.users, //Array.from(this.selectedUsers),
        };
        this.taskUpdated.emit(taskRequest);
      } else {
        // Create new task
        const taskRequest: CreateTaskRequest = {
          projectId: formValue.project,
          priority: formValue.priority,
          title: formValue.title,
          status: formValue.status,
          description: formValue.description,
          startDate: formValue.startDate,
          endDate: formValue.endDate,
          tagIds: Array.from(this.selectedTags),
          assignedUserIds: [], //Array.from(this.selectedUsers),
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

  toggleTagSelection(tagId: string) {
    if (this.selectedTags.has(tagId)) {
      this.selectedTags.delete(tagId);
    } else {
      this.selectedTags.add(tagId);
    }
  }

  isTagSelected(tagId: string): boolean {
    return this.selectedTags.has(tagId);
  }

  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  onAssignedUsersChange(users: string[]) {
    // this.assignedUsers = users;
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
    return this.taskForm.valid /*&& this.selectedUsers.size > 0*/;
  }
}
