import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-tab-panel',
  standalone: true,
  templateUrl: './tab-panel.component.html',
})
export class TabPanelComponent {
  @Input({ required: true }) id!: string;
  @Input({ required: true }) label!: string;
  @Input() icon?: string;

  isActive = signal<boolean>(false);
}