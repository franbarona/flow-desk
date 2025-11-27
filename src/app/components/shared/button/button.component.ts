import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  imports: [CommonModule, IconComponent],
})
export class ButtonComponent {
  @Input() label: string = '';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() style: 'primary' | 'secondary' | 'main' = 'primary';
  @Input() icon?: string;
  @Input() disabled: boolean = false;
  @Output() action = new EventEmitter<void>();

  handleClick(): void {
    if (!this.disabled) {
      this.action.emit();
    }
  }

  getButtonClasses(): string {
    const baseClasses = 'text-gray-900 px-4 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const styleClasses = {
      primary: 'bg-lime-300 hover:bg-lime-400 focus:ring-lime-500',
      secondary: 'bg-gray-200 hover:bg-gray-300 focus:ring-gray-500',
      main: 'w-full bg-lime-300 shadow-xs hover:shadow-lg hover:shadow-lime-100 hover:scale-[1.01] px-6 '
    };

    return `${baseClasses} ${styleClasses[this.style]}`;
  }
}
