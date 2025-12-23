import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Subject, takeUntil } from 'rxjs';
import {
  CreateProjectRequest,
  Project,
  UpdateProjectRequest,
} from '../../models/project.interface';
import { ProjectsTableComponent } from '../../components/projects-table/projects-table.component';
import { ProjectFormComponent } from '../../components/project-form/project-form.component';
import { ModalService } from '../../services/modal.service';
import { SharedModule } from '../../components/shared/shared.module';
import { TourService } from '../../services/tour.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.view.html',
  imports: [SharedModule, ProjectsTableComponent, ProjectFormComponent],
})
export class ProjectsView implements OnInit, AfterViewInit {
  private readonly projectService = inject(ProjectService);
  private readonly modalService = inject(ModalService);
  private readonly tourService = inject(TourService);
  private readonly storage = inject(StorageService);
  private readonly destroy$ = new Subject<void>();
  projects: Project[] = [];
  selectedProject: Project | null = null;
  modalAction: 'update' | 'delete' | null = null;

  get isModalOpen() {
    return this.modalService.isModalOpen;
  }

  get modalTile() {
    if (!this.modalAction) return 'Create project';
    else if (this.modalAction === 'update') return 'Edit project';
    else return 'Delete project';
  }

  ngOnInit(): void {
    // Load initial data
    this.projectService
      .getProjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe((projects) => (this.projects = projects));
  }

  ngAfterViewInit() {
    if (!this.storage.getItem('tourCompleted')) {
      this.initializeTourAndStart();
    }
  }

  addNewProject() {
    this.modalService.openModal();
  }

  openProjectModal(project: Project, event?: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.selectedProject = { ...project };
    this.modalAction = 'update';
    this.modalService.openModal();
  }

  deleteConfirmationModal(project: Project, event?: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.selectedProject = { ...project };
    this.modalAction = 'delete';
    this.modalService.openModal();
  }

  onHandleCreatProject(projectRequest: CreateProjectRequest) {
    this.projectService
      .createProject(projectRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newProject) => {
          console.log('Project created successfully:', newProject);
        },
        error: (error) => {
          console.error('Error creating project:', error);
        },
      });
  }

  onHandleUpdateProject(updatedProject: UpdateProjectRequest) {
    const projectId = updatedProject.id;
    const updatedProjectData: Partial<Project> = {
      name: updatedProject.name,
      color: updatedProject.color,
    };
    this.projectService
      .updateProject(projectId, updatedProjectData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newProject) => {
          console.log('Project updated successfully:', newProject);
        },
        error: (error) => {
          console.error('Error creating project:', error);
        },
      });
  }

  handleDeleteProject() {
    const projectId = this.selectedProject?.id;
    if (!projectId) return;
    this.projectService
      .deleteProject(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('Project deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting project:', error);
        },
      });
    this.closeModal();
  }

  closeModal() {
    this.selectedProject = null;
    this.modalAction = null;
    this.modalService.closeModal();
  }

  private async initializeTourAndStart() {
    const tourSteps = [
      {
        intro: 'Welcome to FlowDesk! <br/> FlowDesk is a task and project management tool. <br/> Create projects, organize tasks, and collaborate seamlessly all in one place',
      },
      {
        element: '#create-project-section',
        intro: 'Create new projects by clicking here.',
        position: 'left',
        disableInteraction: true
      },
      {
        element: '#project-list-section',
        intro: 'This is your project list. <br/> Click on any project to view its tasks.',
        position: 'bottom'
      },
    ];

    await this.tourService.initializeTour(tourSteps);
    await this.tourService.startTour();
  }
}
