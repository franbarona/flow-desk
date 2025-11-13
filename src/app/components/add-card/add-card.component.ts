import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  imports: [CommonModule, FormsModule],
})
export class AddCardComponent {
  @Input() column!: string;
  @Output() cardAdded = new EventEmitter<string>();

  isAdding = false;
  cardText = '';

  startAdding(): void {
    this.isAdding = true;
    // Focus the textarea after view update
    setTimeout(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.focus();
      }
    });
  }

  cancelAdding(): void {
    this.isAdding = false;
    this.cardText = '';
  }

  submitCard(): void {
    if (!this.cardText.trim()) {
      return;
    }

    this.cardAdded.emit(this.cardText);
    this.isAdding = false;
    this.cardText = '';
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault();
      this.submitCard();
    }
    if (event.key === 'Escape') {
      this.cancelAdding();
    }
  }
}