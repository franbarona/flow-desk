import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../models/project.interface';
import { User } from '../../models/user.interface';
import { Tag } from '../../models/tag.interface';
import { CreateTaskRequest, PopulatedTask, UpdateTaskRequest, UpdateTaskStatusRequest } from '../../models/task.interface';
import { EnumStatus } from '../../constants/constants';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/user.service';
import { TagService } from '../../services/tag.service';
import { TaskService } from '../../services/task.service';
import { ModalService } from '../../services/modal.service';
import { TasksBacklogTableComponent } from '../../components/tasks-backlog-table/tasks-backlog-table.component';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { SharedModule } from '../../components/shared/shared.module';
import { TaskBoardComponent } from '../../components/task-board/task-board.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.view.html',
  imports: [SharedModule, TaskBoardComponent, TasksBacklogTableComponent, TaskFormComponent],
})
export class TasksView implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly projectService = inject(ProjectService);
  private readonly userService = inject(UserService);
  private readonly tagService = inject(TagService);
  private readonly taskService = inject(TaskService);
  private readonly modalService = inject(ModalService);
  private readonly destroy$ = new Subject<void>();

  project!: Project;
  tasks: PopulatedTask[] = [];
  users: User[] = [];
  tags: Tag[] = [];
  loading = true;
  selectedTask: PopulatedTask | null = null;
  modalAction: 'update' | 'delete' | null = null;

  get projectName() {
    return this.project?.name || '';
  }

  get backlogTasks() {
    return this.tasks.filter((task) => task.status === EnumStatus.BACKLOG);
  }

  get isModalOpen() {
    return this.modalService.isModalOpen;
  }

  get modalTitle() {
    if (this.selectedTask && this.modalAction === 'delete')
      return 'Delete task' + this.selectedTask.id;
    else if (this.selectedTask) return 'Edit task ' + this.selectedTask.id;
    else return 'Create new task';
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const projectSlug = params['id'];
      this.projectService.getProjectsBySlug(projectSlug).subscribe((project) => {
        if (project) {
          this.project = project;
          this.loadTaskBoardData();
        }
        this.loading = false;
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
      .getTasksByProjectId(this.project.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((tasks) => (this.tasks = tasks));
  }

  addNewTask() {
    this.modalService.openModal();
  }

  openTaskModal(task: PopulatedTask, event?: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.selectedTask = { ...task };
    this.modalAction = 'update';
    this.modalService.openModal();
  }

  deleteConfirmationModal(task: PopulatedTask, event?: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.selectedTask = { ...task };
    this.modalAction = 'delete';
    this.modalService.openModal();
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
    const updatedTaskData: Partial<Omit<PopulatedTask, 'id'>> = {
      title: updatedTask.title,
      description: updatedTask.description,
      status: updatedTask.status,
      priority: updatedTask.priority,
      startDate: new Date(updatedTask.startDate),
      endDate: new Date(updatedTask.endDate),
      tagIds: this.tags.filter((tag) => updatedTask.tagIds.includes(tag.id)).map((tag) => tag.id),
      assignedUserIds: this.users
        .filter((assignedUser) => updatedTask.assignedUserIds?.includes(assignedUser.id))
        .map((assignedUser) => assignedUser.id),
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

  handleUpdateTaskStatus(updatedTaskStatusRequest: UpdateTaskStatusRequest) {
    const taskId = updatedTaskStatusRequest.id;
    const newStatus = updatedTaskStatusRequest.status;
    this.taskService
      .updateTaskStatus(taskId, newStatus)
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

  handleDeleteTask() {
    const taskId = this.selectedTask?.id;
    if (!taskId) return;
    this.taskService
      .deleteTask(taskId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('Task deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting task:', error);
        },
      });
    this.closeModal();
  }

  closeModal() {
    this.selectedTask = null;
    this.modalService.closeModal();
  }
}
