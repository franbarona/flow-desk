import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  imports: [IconComponent],
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() showCloseButton = true;
  @Input() backdropClose = true;
  @Output() closeModal = new EventEmitter<void>();

  onClose() {
    this.closeModal.emit();
  }

  onBackdropClick(event: Event) {
    if (this.backdropClose && event.target === event.currentTarget) {
      this.onClose();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.backdropClose) {
      this.onClose();
    }
  }
}