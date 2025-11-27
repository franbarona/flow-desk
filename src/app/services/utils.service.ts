import { Injectable } from '@angular/core';
import { customAlphabet } from 'nanoid';
import { Observable, of } from 'rxjs';
import { DropdownOptions } from '../models/utils.interface';
import { EnumPriorities, EnumStatus } from '../constants/constants';

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
    for (const statusKey of Object.keys(EnumStatus)) {
      options.push({
        id: statusKey.toLowerCase(),
        name: EnumStatus[statusKey as keyof typeof EnumStatus],
      });
    }
    return of(options);
  }

  templateToRegex(template: string): RegExp {
    const regex = template.replace(/\//g, '\\/').replace(/\{\w+\}/g, '[^\\/]+');
    return new RegExp(`^${regex}$`);
  }

  generateRandomDates(): { pastDate: Date; futureDate: Date } {
    const now = new Date();
    const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;

    // Random date between 1 month ago and now
    const pastDate = new Date(now.getTime() - Math.random() * oneMonthInMs);

    // Random date between now and 1 month in future
    const futureDate = new Date(now.getTime() + Math.random() * oneMonthInMs);

    return { pastDate, futureDate };
  }
}
