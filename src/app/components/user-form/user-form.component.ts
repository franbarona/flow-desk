import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CreateUserRequest, User, UpdateUserRequest } from '../../models/user.interface';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-user-form',
  imports: [SharedModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnChanges {
  @Input() existingUser: User | null = null; // For editing existing tasks
  @Output() userCreated = new EventEmitter<CreateUserRequest>();
  @Output() userUpdated = new EventEmitter<UpdateUserRequest>();
  @Output() modalClosed = new EventEmitter<void>();

  userForm: FormGroup;
  isEditMode = false;

  constructor(private readonly fb: FormBuilder) {
    this.userForm = this.createForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.existingUser) {
      this.isEditMode = true;
      this.populateFormWithTask(this.existingUser);
    } else {
      this.isEditMode = false;
      this.resetForm();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      surnames: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  private populateFormWithTask(user: User) {
    this.userForm.patchValue({
      name: user.name,
      surnames: user.surnames,
    });
  }

  private resetForm() {
    this.userForm.reset();
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;

      if (this.isEditMode && this.existingUser) {
        // Update existing task
        const userRequest: UpdateUserRequest = {
          id: this.existingUser.id,
          name: formValue.name,
          surnames: formValue.surnames,
        };
        this.userUpdated.emit(userRequest);
      } else {
        // Create new task
        const userRequest: CreateUserRequest = {
          name: formValue.name,
          surnames: formValue.surnames,
        };
        this.userCreated.emit(userRequest);
      }

      this.closeModal();
    }
  }

  closeModal() {
    this.resetForm();
    this.isEditMode = false;
    this.modalClosed.emit();
  }

  // Validation helpers
  get nameErrors(): string | null {
    const control = this.userForm.get('name');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Name is required';
    }
    return null;
  }

  get surnamesErrors(): string | null {
    const control = this.userForm.get('surnames');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Surnames are required';
    }
    return null;
  }


  get isFormValid(): boolean {
    return this.userForm.valid;
  }
}
