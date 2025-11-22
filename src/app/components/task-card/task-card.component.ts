import { Component, Input } from '@angular/core';
import { User } from '../../models/user.interface';
import { Tag } from '../../models/tag.interface';
import { EnumTaskPriority, Task } from '../../models/task.interface';
import { CommonModule } from '@angular/common';
import { MOCK_TAGS_DATA, MOCK_USERS_DATA } from '../../constants/mocks';
import { IconComponent } from '../shared/icon/icon.component';

@Component({
  selector: 'app-task-card',
  imports: [CommonModule, IconComponent],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  @Input() task!: Task;

  getAssignedUserData(userId: string): User {
    return MOCK_USERS_DATA.find((user) => user.id === userId)!;
  }

  getTagData(tagId: string): Tag {
    return MOCK_TAGS_DATA.find((tag) => tag.id === tagId)!;
  }

  getPriorityColor(): string {
    switch (this.task.priority) {
      case EnumTaskPriority.LOW:
        return 'text-gray-600 bg-gray-100';
      case EnumTaskPriority.MEDIUM:
        return 'text-yellow-600 bg-yellow-100';
      case EnumTaskPriority.HIGH:
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }
}
