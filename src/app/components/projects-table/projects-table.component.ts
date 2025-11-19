import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/project.interface';

@Component({
  selector: 'app-projects-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-x-auto bg-white shadow-md rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <!-- Header -->
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Project
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ID
            </th>
            <th class="px-6 py-3 relative">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>

        <!-- Body -->
        <tbody class="bg-white divide-y divide-gray-200">
          @for (project of projects; track $index) {
          <tr class="hover:bg-gray-50 transition-colors duration-150">
            <!-- Proyecto (Nombre) -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ project.name }}
                  </div>
                </div>
              </div>
            </td>

            <!-- ID -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                #{{ project.id }}
              </span>
            </td>

            <!-- Acciones -->
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                (click)="onEditProject(project)"
                class="text-indigo-600 hover:text-indigo-900 mr-3 transition-colors duration-150"
              >
                Editar
              </button>
              <button
                (click)="onDeleteProject(project)"
                class="text-red-600 hover:text-red-900 transition-colors duration-150"
              >
                Eliminar
              </button>
            </td>
          </tr>
          }

          <!-- Estado vacío -->
          @if (projects.length === 0) {
          <tr>
            <td colspan="4" class="px-6 py-12 text-center">
              <div class="text-gray-500">
                <svg
                  class="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a2.25 2.25 0 01-2.4 2.8l-2.324.306a.75.75 0 01-.835-.607l-.293-1.757a.75.75 0 01.45-.906l2.316-.69a2.25 2.25 0 012.566 2.857z"
                  />
                </svg>
                <p class="text-lg font-medium">No hay usuarios</p>
                <p class="text-sm">Comienza agregando algunos usuarios a la lista.</p>
              </div>
            </td>
          </tr>
          }
        </tbody>
      </table>
    </div>

    <!-- Loading state -->
    <div *ngIf="isLoading" class="bg-white shadow-md rounded-lg p-8">
      <div class="flex justify-center items-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span class="ml-3 text-gray-600">Cargando usuarios...</span>
      </div>
    </div>
  `,
  styles: [
    `
      /* Estilos adicionales si son necesarios */
      .table-container {
        min-height: 200px;
      }
    `,
  ],
})
export class ProjectsTableComponent {
  @Input() projects: Project[] = [];
  @Input() isLoading: boolean = false;

  // Método para optimizar el renderizado
  trackByProjectId(index: number, project: Project): string {
    return project.id;
  }

  // Eventos para acciones (puedes emitir eventos o manejar según tu necesidad)
  onEditProject(project: Project): void {
    // Aquí puedes emitir un evento o llamar a un servicio
  }

  onDeleteProject(project: Project): void {
    // Aquí puedes emitir un evento o llamar a un servicio
  }
}
