import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  TemplateRef,
  ChangeDetectorRef,
  inject,
  AfterViewInit,
} from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Project } from '../../models/project.interface';
import { TableAction, TableColumn } from '../../models/table.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects-table',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './projects-table.component.html',
})
export class ProjectsTableComponent implements AfterViewInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  @Input() projects: Project[] = [];
  @Input() isLoading: boolean = false;
  @Output() editProject = new EventEmitter<Project>();
  @Output() deleteProject = new EventEmitter<Project>();
  @ViewChild('idTemplate') idTemplate!: TemplateRef<any>;
  @ViewChild('colorTemplate') colorTemplate!: TemplateRef<any>;

  columns: TableColumn<Project>[] = [];
  actions: TableAction<Project>[] = [
    {
      label: '',
      action: (item) => this.navigateToProject(item.slug),
      icon: 'call_made',
    },
    {
      label: '',
      action: (item) => this.onEditProject(item),
      icon: 'edit_square',
    },
    {
      label: '',
      action: (item) => this.onDeleteProject(item),
      icon: 'delete',
    },
  ];

  ngAfterViewInit() {
    // 🆕 Configurar las columnas con templates personalizados
    this.columns = [
      { key: 'id', title: 'ID', sortable: true, width: '5em', cellTemplate: this.idTemplate, cellClass: '' },
      {
        key: 'color',
        title: '',
        width: '5em',
        cellTemplate: this.colorTemplate, // Template personalizado
      },
      { key: 'name', title: 'Name', sortable: true },
    ];

    // 🆕 Force change detection
    this.cdr.detectChanges();
  }

  // Event actions
  navigateToProject(slug: string) {
    this.router.navigate(['/project', slug]);
  }

  onEditProject(project: Project): void {
    this.editProject.emit(project);
  }

  onDeleteProject(project: Project): void {
    this.deleteProject.emit(project);
  }
}
