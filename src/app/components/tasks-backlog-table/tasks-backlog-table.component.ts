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
import { TableAction, TableColumn } from '../../models/table.interface';
import { PopulatedTask } from '../../models/task.interface';

@Component({
  selector: 'app-tasks-backlog-table',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './tasks-backlog-table.component.html',
})
export class TasksBacklogTableComponent implements AfterViewInit {
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() backlogTasks: PopulatedTask[] = [];
  @Input() isLoading: boolean = false;
  @Output() editTask = new EventEmitter<PopulatedTask>();
  @Output() deleteTask = new EventEmitter<PopulatedTask>();
  @ViewChild('idTemplate') idTemplate!: TemplateRef<any>;
  @ViewChild('colorTemplate') colorTemplate!: TemplateRef<any>;

  columns: TableColumn<PopulatedTask>[] = [];
  actions: TableAction<PopulatedTask>[] = [
    {
      label: '',
      action: (item) => this.onEditTask(item),
      icon: 'edit_square',
    },
    {
      label: '',
      action: (item) => this.onDeleteTask(item),
      icon: 'delete',
    },
  ];

  ngAfterViewInit() {
    // Config custom column templates
    this.columns = [
      {
        key: 'id',
        title: 'ID',
        sortable: true,
        width: '5em',
        cellTemplate: this.idTemplate,
        cellClass: '',
      },
      { key: 'title', title: 'Title', sortable: true },
    ];

    // Force change detection
    this.cdr.detectChanges();
  }

  onEditTask(task: PopulatedTask): void {
    this.editTask.emit(task);
  }

  onDeleteTask(task: PopulatedTask): void {
    this.deleteTask.emit(task);
  }
}
