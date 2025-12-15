import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../models/project.interface';
import { User } from '../../models/user.interface';
import { Tag } from '../../models/tag.interface';
import {
  CreateTaskRequest,
  PopulatedTask,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
} from '../../models/task.interface';
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
import { TourService } from '../../services/tour.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.view.html',
  imports: [SharedModule, TaskBoardComponent, TasksBacklogTableComponent, TaskFormComponent],
})
export class TasksView implements OnInit, AfterViewInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly projectService = inject(ProjectService);
  private readonly userService = inject(UserService);
  private readonly tagService = inject(TagService);
  private readonly taskService = inject(TaskService);
  private readonly modalService = inject(ModalService);
  private readonly tourService = inject(TourService);
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

  ngAfterViewInit() {
    if (!localStorage.getItem('tourCompleted')) {
      this.initializeTourAndStart();
    }

    this.tourService.onTourCompleted(() => {
      localStorage.setItem('tourCompleted', 'true');
    });
  }

  private async initializeTourAndStart() {
    const tourSteps = [
      {
        intro:
          'This is the Kanban view. Here you will find all the project`s tasks organized by status.',
      },
      {
        element: '#tabs-section',
        intro: 'Switch to the Backlog view using this tab to see all your tasks in a list format.',
        position: 'bottom',
        disableInteraction: true,
      },
      {
        element: '#create-task-section',
        intro: 'Create new tasks by clicking here.',
        position: 'left',
        disableInteraction: true,
      },
      {
        element: '#kanban-section',
        intro:
          'Click on a task to edit it. <br/> You can also drag it to another column to change its status.',
        position: 'right',
        disableInteraction: true,
      },
    ];

    await this.tourService.initializeTour(tourSteps);
    await this.tourService.startTour();
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

  onTaskCreated(taskRequest: CreateTaskRequest) {
    this.taskService
      .createTask(taskRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newTask) => {
          console.log('Task created successfully:', newTask);
        },
        error: (error) => {
          console.error('Error creating task:', error);
        },
      });
  }

  onTaskUpdated(updatedTask: UpdateTaskRequest) {
    const taskId = updatedTask.id;
    const updatedTaskData: Partial<Omit<PopulatedTask, 'id'>> = {
      projectId: updatedTask.projectId,
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
        },
        error: (error) => {
          console.error('Error creating task:', error);
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
        },
        error: (error) => {
          console.error('Error creating task:', error);
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
