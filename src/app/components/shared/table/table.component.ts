import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ContentChild,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn, TableAction, TableConfig } from '../../../models/table.interface';
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent<T = any> implements OnInit, OnChanges {
  @Input() data: T[] = [];
  @Input() columns: TableColumn<T>[] = [];
  @Input() actions?: TableAction<T>[];
  @Input() config: TableConfig = {};
  @Input() loading: boolean = false;
  @Input() emptyMessage: string = 'No avaliable data';
  @Input() searchTerm: string = '';
  @Output() searchChange = new EventEmitter<string>();

  // Events
  @Output() rowClick = new EventEmitter<{ row: T; index?: number }>();
  @Output() columnSort = new EventEmitter<{ column: TableColumn<T>; direction: 'asc' | 'desc' }>();

  // Custom template cells
  @ContentChild('customCell') customCellTemplate?: TemplateRef<any>;
  @ContentChild('customAction') customActionTemplate?: TemplateRef<any>;

  // Internal status
  sortColumn?: TableColumn<T>;
  sortDirection: 'asc' | 'desc' = 'asc';
  processedData: T[] = [];
  currentSearchTerm: string = '';
  filteredData: T[] = [];

  // Default config
  defaultConfig: TableConfig = {
    showHeader: true,
    striped: true,
    hoverable: true,
    bordered: false,
    compact: false,
    loading: false,
    emptyMessage: 'No data available',
    containerClass: '',
    tableClass: '',
    searchable: true,
    searchPlaceholder: 'Search...',
    searchColumns: [],
  };

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.config = { ...this.defaultConfig, ...this.config };
    this.processData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] || changes['columns'] || changes['searchTerm']) {
      this.processData();
    }
  }

  private processData() {
    this.filteredData = this.applySearch(this.data);
    this.processedData = [...this.filteredData];

    // Aplicar ordenamiento si existe
    if (this.sortColumn) {
      this.applySorting();
    }

    this.cdr.markForCheck();
  }

  onColumnClick(column: TableColumn<T>) {
    if (!column.sortable) return;

    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.applySorting();
    this.columnSort.emit({ column, direction: this.sortDirection });
  }

  // 🆕 Search
  private applySearch(data: T[]): T[] {
    const searchTerm = (this.searchTerm || this.currentSearchTerm).toLowerCase().trim();
    if (!searchTerm || !this.config.searchable) {
      return data;
    }

    return data.filter((item) => {
      // Si hay columnas específicas definidas, buscar solo en esas
      const columnsToSearch = this.config.searchColumns?.length
        ? this.config.searchColumns
        : this.columns.map((col) => col.key as string);

      return columnsToSearch.some((columnKey) => {
        const value = this.getNestedProperty(item, columnKey);
        return String(value || '')
          .toLowerCase()
          .includes(searchTerm);
      });
    });
  }

  // 🆕 Manage changes in search input
  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.currentSearchTerm = target.value;
    this.processData();
    this.searchChange.emit(this.currentSearchTerm);
  }

  // 🆕 Clean search
  clearSearch() {
    this.currentSearchTerm = '';
    this.processData();
    this.searchChange.emit('');
  }

  // Sorting
  private applySorting() {
    if (!this.sortColumn) return;

    this.processedData.sort((a, b) => {
      const aVal = this.getCellValue(a, this.sortColumn!);
      const bVal = this.getCellValue(b, this.sortColumn!);

      let comparison = 0;

      if (aVal > bVal) {
        comparison = 1;
      } else if (aVal < bVal) {
        comparison = -1;
      }

      return this.sortDirection === 'desc' ? comparison * -1 : comparison;
    });
  }

  getCellValue(row: T, column: TableColumn<T>): any {
    const value = this.getNestedProperty(row, column.key as string);
    return column.formatter ? column.formatter(value, row) : value;
  }

  buildTemplateContext(row: T, column: TableColumn<T>, index: number): any {
    const baseContext: Record<string, any> = {
      $implicit: this.getCellValue(row, column),
      value: this.getCellValue(row, column),
      row: row,
      column: column,
      index: index
    };

    // Agregar parámetros personalizados de la columna
    if (column.templateParams) {
      Object.keys(column.templateParams).forEach(key => {
        const paramValue = column.templateParams![key];
        baseContext[key] = typeof paramValue === 'function'
          ? paramValue(row, index)
          : paramValue;
      });
    }

    return baseContext;
  }

  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  onRowClick(row: T, index: number) {
    this.rowClick.emit({ row, index });
  }

  onActionClick(action: TableAction<T>, row: T, index: number, event: Event) {
    event.stopPropagation();
    action.action(row, index);
  }

  shouldShowAction(action: TableAction<T>, row: T): boolean {
    return action.visible ? action.visible(row) : true;
  }

  isActionDisabled(action: TableAction<T>, row: T): boolean {
    return action.disabled ? action.disabled(row) : false;
  }

  get tableClasses(): string {
    const classes = ['w-full', 'text-sm', 'text-left', 'text-gray-500', 'shadow-md', 'rounded'];

    if (this.config.bordered) {
      classes.push('border', 'border-gray-200');
    }

    if (this.config.compact) {
      classes.push('table-compact');
    }

    if (this.config.tableClass) {
      classes.push(this.config.tableClass);
    }

    return classes.join(' ');
  }

  get containerClasses(): string {
    const classes = ['relative', 'overflow-x-auto'];

    if (this.config.containerClass) {
      classes.push(this.config.containerClass);
    }

    return classes.join(' ');
  }

  get rowClasses(): string {
    const classes = [];

    if (this.config.striped) {
      classes.push('odd:bg-white', 'even:bg-gray-50');
    } else {
      classes.push('bg-white');
    }

    if (this.config.hoverable) {
      classes.push('hover:bg-gray-100', 'cursor-pointer');
    }

    if (this.config.bordered) {
      classes.push('border-b');
    }

    return classes.join(' ');
  }
}