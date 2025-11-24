import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss',
  imports: [CommonModule, IconComponent],
})
export class ColorPickerComponent {
  @Input() selectedColor: string = '';
  @Output() colorSelected = new EventEmitter<string>();

  colors = [
    'red',
    'orange',
    'amber',
    'yellow',
    'lime',
    'green',
    'teal',
    'sky',
    'blue',
    'purple',
    'pink',
    'rose',
    'slate',
    'gray',
    'black',
  ];

  selectColor(color: string): void {
    this.selectedColor = color;
    this.colorSelected.emit(color);
  }

  trackByColor(index: number, color: any): string {
    return color.value;
  }
}
