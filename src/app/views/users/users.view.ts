import { Component, inject, OnInit } from '@angular/core';
import { UsersTableComponent } from '../../components/users-table/users-table.component';
import { Subject, takeUntil } from 'rxjs';
import { CreateUserRequest, UpdateUserRequest, User } from '../../models/user.interface';
import { ModalService } from '../../services/modal.service';
import { UserService } from '../../services/user.service';
import { SharedModule } from '../../components/shared/shared.module';
import { UserFormComponent } from '../../components/user-form/user-form.component';

@Component({
  selector: 'app-users',
  imports: [SharedModule, UsersTableComponent, UserFormComponent],
  templateUrl: './users.view.html'
})
export class UsersView implements OnInit {
  private readonly userService = inject(UserService);
  private readonly modalService = inject(ModalService);
  private readonly destroy$ = new Subject<void>();
  users: User[] = [];
  selectedUser: User | null = null;
  modalAction: null | 'update' | 'delete' = null;

  get isModalOpen() {
    return this.modalService.isModalOpen;
  }

  get modalTile() {
    if (!this.modalAction) return 'Create user';
    else if (this.modalAction === 'update') return 'Edit user';
    else return 'Delete user';
  }

  ngOnInit(): void {
    // Load initial data
    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => (this.users = users));
  }

  addNewUser() {
    console.log(this.modalAction);
    this.modalService.openModal();
  }

  openUserModal(user: User, event?: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.selectedUser = { ...user };
    this.modalAction = 'update';
    this.modalService.openModal();
  }

  deleteConfirmationModal(user: User, event?: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.selectedUser = { ...user };
    this.modalAction = 'delete';
    this.modalService.openModal();
  }

  /**
   * Handles creation of new users
   */
  onHandleCreatUser(userRequest: CreateUserRequest) {
    this.userService
      .createUser(userRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newUser) => {
          console.log('User created successfully:', newUser);
          // You can add a success notification here
        },
        error: (error) => {
          console.error('Error creating user:', error);
          // You can add error handling/notification here
        },
      });
  }

  onHandleUpdateUser(updatedUser: UpdateUserRequest) {
    const userId = updatedUser.id;
    const updatedUserData: Partial<User> = {
      name: updatedUser.name,
      surnames: updatedUser.surnames,
    };
    this.userService
      .updateUser(userId, updatedUserData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newUser) => {
          console.log('User updated successfully:', newUser);
        },
        error: (error) => {
          console.error('Error creating user:', error);
        },
      });
  }

  handleDeleteUser() {
    const userId = this.selectedUser?.id;
    if (!userId) return;
    this.userService
      .deleteUser(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('User deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        },
      });
    this.closeModal();
  }

  closeModal() {
    this.selectedUser = null;
    this.modalAction = null;
    this.modalService.closeModal();
  }
}
