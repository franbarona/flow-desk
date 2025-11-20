import { Component, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-projects',
  templateUrl: './projects.view.html',
  styleUrl: './projects.view.scss',
  imports: [SharedModule, ProjectsTableComponent, ProjectFormComponent],
})
export class ProjectsView implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly modalService = inject(ModalService);
  private readonly destroy$ = new Subject<void>();
  projects: Project[] = [];
  selectedProject: Project | null = null;

  get isModalOpen() {
    return this.modalService.isModalOpen;
  }

  ngOnInit(): void {
    // Load initial data
    this.projectService
      .getProjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe((projects) => (this.projects = projects));
  }

  addNewProject() {
    this.modalService.openModal();
  }

  openProjectModal(project: Project, event?: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.selectedProject = { ...project }; // Create a copy for editing

    // Also update the modal service if other components need to know
    this.modalService.openModal();
  }

  /**
   * Handles creation of new projects
   */
  onProjectCreated(projectRequest: CreateProjectRequest) {
    this.projectService
      .createProject(projectRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newProject) => {
          console.log('Project created successfully:', newProject);
          // You can add a success notification here
        },
        error: (error) => {
          console.error('Error creating project:', error);
          // You can add error handling/notification here
        },
      });
  }

  onProjectUpdated(updatedProject: UpdateProjectRequest) {
    const projectId = updatedProject.id;
    const updatedProjectData: Partial<Project> = {
      name: updatedProject.name,
      color: updatedProject.color
    };
    this.projectService
      .updateProject(projectId, updatedProjectData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newProject) => {
          console.log('Project updated successfully:', newProject);
          // You can add a success notification here
        },
        error: (error) => {
          console.error('Error creating project:', error);
          // You can add error handling/notification here
        },
      });
  }

  closeModal() {
    this.selectedProject = null;
    this.modalService.closeModal();
  }
}
