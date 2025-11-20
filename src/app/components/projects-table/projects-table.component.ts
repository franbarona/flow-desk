import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Project } from '../../models/project.interface';
import { TableAction, TableColumn } from '../../models/table.interface';

@Component({
  selector: 'app-projects-table',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './projects-table.component.html',
})
export class ProjectsTableComponent {
  @Input() projects: Project[] = [];
  @Input() isLoading: boolean = false;
  @Output() editProject = new EventEmitter<Project>();

  columns: TableColumn<Project>[] = [
    { key: 'id', title: 'ID', sortable: true, width:'10em', cellClass: 'max-w-[10em] truncate' },
    { key: 'color', title: 'Color', sortable: false },
    { key: 'name', title: 'Name', sortable: true },
  ];

  actions: TableAction<Project>[] = [
    {
      label: '',
      action: (item) => this.onEditProject(item),
      icon: 'edit_square'
    },
    {
      label: '',
      action: (item) => this.onDeleteProject(item),
      icon: 'delete'
    },
  ];

  // Event actions (TODO)
  onEditProject(project: Project): void {
    // TODO
    this.editProject.emit(project);
  }

  onDeleteProject(project: Project): void {
    // TODO
  }
}
