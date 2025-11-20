import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  imports: [CommonModule],
})
export class ButtonComponent {
  @Input() label: string = '';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() style: 'primary' | 'secondary' = 'primary';
  @Input() disabled: boolean = false;
  @Output() action = new EventEmitter<void>();

  handleClick(): void {
    if (!this.disabled) {
      this.action.emit();
    }
  }

  getButtonClasses(): string {
    const baseClasses = 'text-gray-900 px-4 py-2 rounded-md font-medium transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const styleClasses = {
      primary: 'bg-lime-300 hover:bg-lime-400 focus:ring-lime-500',
      secondary: 'bg-gray-200 hover:bg-gray-300 focus:ring-gray-500'
    };

    return `${baseClasses} ${styleClasses[this.style]}`;
  }
}
