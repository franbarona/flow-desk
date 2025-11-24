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
import { Tag } from '../../models/tag.interface';
import { TableAction, TableColumn } from '../../models/table.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tags-table',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './tags-table.component.html',
})
export class TagsTableComponent implements AfterViewInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  @Input() tags: Tag[] = [];
  @Input() isLoading: boolean = false;
  @Output() editTag = new EventEmitter<Tag>();
  @Output() deleteTag = new EventEmitter<Tag>();
  @ViewChild('idTemplate') idTemplate!: TemplateRef<any>;
  @ViewChild('tagTemplate') tagTemplate!: TemplateRef<any>;

  columns: TableColumn<Tag>[] = [];
  actions: TableAction<Tag>[] = [
    {
      label: '',
      action: (item) => this.onEditTag(item),
      icon: 'edit_square',
    },
    {
      label: '',
      action: (item) => this.onDeleteTag(item),
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
      {
        key: 'name',
        title: 'Tag',
        sortable: true,
        cellTemplate: this.tagTemplate,
        templateParams: {
          colorValue: (row: Tag) => row.color,
          tagName: (row: Tag) => row.name,
        }
      },
    ];

    // Force change detection
    this.cdr.detectChanges();
  }

  // Event actions
  navigateToTag(slug: string) {
    this.router.navigate(['/tag', slug]);
  }

  onEditTag(tag: Tag): void {
    this.editTag.emit(tag);
  }

  onDeleteTag(tag: Tag): void {
    this.deleteTag.emit(tag);
  }
}