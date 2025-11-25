import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Project, ProjectRequest } from '../models/project.interface';
import { UtilsService } from './utils.service';
import { DropdownOptions } from '../models/utils.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly PROJECTS_STORAGE_KEY = 'projects';
  private readonly projectsSubject = new BehaviorSubject<Project[]>(this.loadProjectsFromStorage());
  private readonly utilsService = inject(UtilsService);
  projects$ = this.projectsSubject.asObservable();

  /**
   * Get all projects
   */
  getProjects(): Observable<Project[]> {
    return this.projects$;
  }

  /**
   * Get all projects (actual snapshot)
   */
  getProjectsSnapshot(): Project[] {
    return this.projectsSubject.value;
  }

  getProjectOptions(): Observable<DropdownOptions[]> {
    const options: DropdownOptions[] = [];
    for (const project of this.projectsSubject.value) {
      options.push({
        id: project.id,
        name: project.name,
      });
    }
    return of(options);
  }

  /**
   * Get project by slug
   */
  getProjectsBySlug(slug: string): Observable<Project | undefined> {
    const project = this.projectsSubject.value.find((proj) => proj.slug === slug);
    return of(project);
  }

  /**
   * Create new project
   */
  createProject(projectRequest: ProjectRequest): Observable<Project> {
    const newProject: Project = {
      id: this.utilsService.generateId(),
      name: projectRequest.name,
      color: projectRequest.color,
      slug: projectRequest.slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const currentProjects = this.projectsSubject.value;
    this.projectsSubject.next([...currentProjects, newProject]);
    this.saveProjectsToStorage();

    return of(newProject);
  }

  /**
   * Update current project
   */
  updateProject(id: string, updates: Partial<Omit<Project, 'id'>>): Observable<Project | null> {
    const currentProjects = this.projectsSubject.value;
    const projectIndex = currentProjects.findIndex((project) => project.id === id);

    if (projectIndex === -1) {
      return of(null);
    }

    const updatedProject: Project = {
      ...currentProjects[projectIndex],
      ...updates,
      updatedAt: new Date(),
    };

    const newProjects = [
      ...currentProjects.slice(0, projectIndex),
      updatedProject,
      ...currentProjects.slice(projectIndex + 1),
    ];

    this.projectsSubject.next(newProjects);
    this.saveProjectsToStorage();

    return of(updatedProject);
  }

  /**
   * Delete project
   */
  deleteProject(id: string): Observable<boolean> {
    const currentProjects = this.projectsSubject.value;
    const filteredProjects = currentProjects.filter((project) => project.id !== id);

    if (filteredProjects.length === currentProjects.length) {
      return of(false); // Project no encontrado
    }

    this.projectsSubject.next(filteredProjects);
    this.saveProjectsToStorage();

    return of(true);
  }

  /**
   * Clear all projects (util for testing)
   */
  clearAll(): void {
    this.projectsSubject.next([]);
    globalThis.localStorage.removeItem(this.PROJECTS_STORAGE_KEY);
  }

  // ============ PRIVATE METHODS ============

  private loadProjectsFromStorage(): Project[] {
    try {
      const stored = globalThis.localStorage?.getItem(this.PROJECTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading projects from storage:', error);
      return [];
    }
  }

  private saveProjectsToStorage(): void {
    try {
      globalThis.localStorage.setItem(
        this.PROJECTS_STORAGE_KEY,
        JSON.stringify(this.projectsSubject.value)
      );
    } catch (error) {
      console.error('Error saving projects to storage:', error);
    }
  }

  initializeProjectsSampleData(): void {
    this.createProject({ name: 'Median', slug: 'median', color: 'pink' });
    this.createProject({ name: 'Stratom', slug: 'stratom', color: 'gray' });
    this.createProject({ name: 'Parisin', slug: 'parisin', color: 'yellow' });
  }
}
