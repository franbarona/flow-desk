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
    { name: 'Red', value: 'oklch(64.5% 0.246 16.439)' },
    { name: 'Blue', value: 'oklch(62.3% 0.214 259.815)' },
    { name: 'Green', value: 'oklch(72.3% 0.219 149.579)' },
    { name: 'Yellow', value: 'oklch(79.5% 0.184 86.047)' },
    { name: 'Purple', value: 'oklch(60.6% 0.25 292.717)' },
    { name: 'Pink', value: 'oklch(82.3% 0.12 346.018)' },
    { name: 'Orange', value: 'oklch(75% 0.183 55.934)' },
    { name: 'Gray', value: 'oklch(55.1% 0.027 264.364)' }
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