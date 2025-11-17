import { Component, Input, OnInit } from '@angular/core';
import {User, EnumTaskPriority, Tag, Task} from '../../models/task.interface';
import { CommonModule } from '@angular/common';
import { MOCK_TAGS_DATA, MOCK_USERS_DATA } from '../../constants/mocks';

@Component({
  selector: 'app-task-card',
  imports: [CommonModule],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
})
export class TaskCard implements OnInit {
  @Input() task!: Task;

  ngOnInit(): void {
  }

  getAssignedUserData(userId: number): User {
    return MOCK_USERS_DATA.find(user => user.id === userId)!;
  }

  getTagData(tagId: number): Tag {
    return MOCK_TAGS_DATA.find(tag => tag.id === tagId)!;
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
