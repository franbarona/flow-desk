import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { TableAction, TableColumn } from '../../models/table.interface';
import { SharedModule } from '../shared/shared.module';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './users-table.component.html',
})
export class UsersTableComponent implements AfterViewInit {
  private readonly cdr = inject(ChangeDetectorRef);
  @Input() users: User[] = [];
  @Input() isLoading: boolean = false;
  @Output() editUser = new EventEmitter<User>();
  @Output() deleteUser = new EventEmitter<User>();
  @ViewChild('idTemplate') idTemplate!: TemplateRef<any>;
  @ViewChild('avatarTemplate') avatarTemplate!: TemplateRef<any>;

  columns: TableColumn<User>[] = [];
  actions: TableAction<User>[] = [
    {
      label: '',
      action: (item) => this.onEditUser(item),
      icon: 'edit_square',
    },
    {
      label: '',
      action: (item) => this.onDeleteUser(item),
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
        key: 'avatarUrl',
        title: '',
        width: '5em',
        cellTemplate: this.avatarTemplate,
      },
      { key: 'name', title: 'Name', sortable: true },
      { key: 'surnames', title: 'Surnames', sortable: true },
    ];

    // 🆕 Force change detection
    this.cdr.detectChanges();
  }

  // Manage error image
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/40x40/6B7280/FFFFFF?text=U';
  }

  // Event actions
  onEditUser(user: User): void {
    this.editUser.emit(user);
  }

  onDeleteUser(user: User): void {
    this.deleteUser.emit(user);
  }
}
