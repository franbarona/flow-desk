import { Injectable } from '@angular/core';
import { customAlphabet } from 'nanoid';
import { Observable, of } from 'rxjs';
import { DropdownOptions } from '../models/utils.interface';
import { EnumPriorities, EnumStatus } from '../constants/mocks';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  generateId(): string {
    const noZeroNanoid = customAlphabet('123456789', 6); //ABCDEFGHIJKLMNOPQRSTUVWXYZ
    return noZeroNanoid();
  }

  /**
   * Get priorities
   */
  getPriorities(): Observable<string[]> {
    return of(['low', 'medium', 'high']);
  }

  getPriorityOptions(): Observable<DropdownOptions[]> {
    const options: DropdownOptions[] = [];
    for (const priority of Object.values(EnumPriorities)) {
      options.push({
        id: priority,
        name: priority,
      });
    }
    return of(options);
  }

  /**
   * Get status
   */
  getStatusOptions(): Observable<DropdownOptions[]> {
    const options: DropdownOptions[] = [];
    for (const status of Object.values(EnumStatus)) {
      options.push({
        id: status,
        name: status,
      });
    }
    return of(options);
  }
}
