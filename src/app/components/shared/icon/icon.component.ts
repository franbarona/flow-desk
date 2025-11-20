import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  imports: [CommonModule],
})
export class IconComponent {
  @Input() icon!: string;
  @Input() color?: string;
  @Input() size?: number;
}
