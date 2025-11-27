import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopulatedTask } from '../../models/task.interface';
import { EnumPriorities } from '../../constants/constants';
import { IconComponent } from '../shared/icon/icon.component';

@Component({
  selector: 'app-task-card',
  imports: [CommonModule, IconComponent],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  @Input() task!: PopulatedTask;

  getPriorityColor(): string {
    switch (this.task.priority) {
      case EnumPriorities.LOW:
        return 'text-gray-600 bg-gray-100';
      case EnumPriorities.MEDIUM:
        return 'text-yellow-600 bg-yellow-100';
      case EnumPriorities.HIGH:
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }
}
