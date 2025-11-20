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
    { name: 'Black', value: '#000' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Gray', value: '#6b7280' }
  ];

  selectColor(color: string): void {
    this.selectedColor = color;
    this.colorSelected.emit(color);
  }

  trackByColor(index: number, color: any): string {
    return color.value;
  }

  getContrastColor(backgroundColor: string): string {
    // Convierte el color hex a RGB
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calcula la luminancia
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Retorna blanco o negro según la luminancia
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }
}