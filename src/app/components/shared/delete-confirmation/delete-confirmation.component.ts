import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

export interface DeleteConfirmationConfig {
  title?: string;
  message?: string;
  itemName?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showIcon?: boolean;
}

@Component({
  selector: 'app-delete-confirmation',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './delete-confirmation.component.html'
})
export class DeleteConfirmationComponent {
  @Input() title!: string;
  @Input() isLoading = false;
  
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    if (!this.isLoading) {
      this.confirmed.emit();
    }
  }

  onCancel(): void {
    if (!this.isLoading) {
      this.cancelled.emit();
    }
  }
}