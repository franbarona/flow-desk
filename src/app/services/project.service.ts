import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import * as uuid from 'uuid';
import { Project, ProjectRequest } from '../models/project.interface';
import { MOCK_PROJECTS_DATA } from '../constants/mocks';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  projects$ = new BehaviorSubject<Project[]>(MOCK_PROJECTS_DATA);

  get projectsValue(): Project[] {
    return this.projects$.value;
  }

  getProjects(): Observable<Project[]> {
    return this.projects$.asObservable();
  }

  getProjectsBySlug(slug: string): Observable<Project | undefined> {
    const project = this.projectsValue.find((proj) => proj.slug === slug);
    return of(project);
  }

  createProject(projectRequest: ProjectRequest): Observable<Project> {
    const newProject: Project = {
      id: uuid.v4(),
      name: projectRequest.name,
      slug: projectRequest.slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const currentProjects = this.projects$.value;
    this.projects$.next([...currentProjects, newProject]);

    return of(newProject);
  }

  updateProject(projectId: string, updates: Partial<Project>): Observable<Project | null> {
    const currentProjects = this.projects$.value;
    const projectIndex = currentProjects.findIndex((project) => project.id === projectId);

    if (projectIndex === -1) {
      return of(null);
    }

    const updatedProject = {
      ...currentProjects[projectIndex],
      ...updates,
      updatedAt: new Date(),
    };

    const updatedProjects = [...currentProjects];
    updatedProjects[projectIndex] = updatedProject;
    this.projects$.next(updatedProjects);

    return of(updatedProject);
  }

  deleteProject(projectId: string): Observable<boolean> {
    const currentProjects = this.projects$.value;
    const projectIndex = currentProjects.findIndex((project) => project.id === projectId);

    if (projectIndex === -1) {
      return of(false); // Proyecto no encontrado
    }

    const updatedProjects = currentProjects.filter((project) => project.id !== projectId);
    this.projects$.next(updatedProjects);

    return of(true); // Eliminación exitosa
  }
}
