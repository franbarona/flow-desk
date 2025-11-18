import { Component, inject, OnInit } from '@angular/core';
import { UsersTableComponent } from '../../components/users-table/users-table.component';
import { TaskService } from '../../services/task.service';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../models/task.interface';

@Component({
  selector: 'app-users',
  imports: [UsersTableComponent],
  templateUrl: './users.view.html',
  styleUrl: './users.view.scss',
})
export class UsersView implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly destroy$ = new Subject<void>();
  users: User[] = [];

  ngOnInit(): void {
    // Load initial data
    this.taskService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => (this.users = users));
  }
}
