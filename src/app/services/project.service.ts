import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import * as uuid from 'uuid';
import { Project, ProjectRequest } from '../models/project.interface';
import { MOCK_PROJECTS_DATA } from '../constants/mocks';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly projects$ = new BehaviorSubject<Project[]>(MOCK_PROJECTS_DATA);

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
}
