import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, Tag } from '../models/task.interface';

export interface ModalData {
  users?: User[];
  tags?: Tag[];
  // You can add more data here if needed for different modal configurations
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private readonly isModalOpenSubject = new BehaviorSubject<boolean>(false);
  private readonly modalDataSubject = new BehaviorSubject<ModalData | null>(null);

  // Observables for components to subscribe to
  public isModalOpen$: Observable<boolean> = this.isModalOpenSubject.asObservable();
  public modalData$: Observable<ModalData | null> = this.modalDataSubject.asObservable();

  /**
   * Opens the task creation modal
   * @param data Optional data to pass to the modal (users, tags, etc.)
   */
  openModal(data?: ModalData): void {
    if (data) {
      this.modalDataSubject.next(data);
    }
    this.isModalOpenSubject.next(true);
  }

  /**
   * Closes the task creation modal
   */
  closeModal(): void {
    this.isModalOpenSubject.next(false);
    // Optionally clear the data when closing
    // this.modalDataSubject.next(null);
  }

  /**
   * Gets the current modal state
   */
  get isModalOpen(): boolean {
    return this.isModalOpenSubject.value;
  }

  /**
   * Gets the current modal data
   */
  get modalData(): ModalData | null {
    return this.modalDataSubject.value;
  }

  /**
   * Updates modal data without opening/closing the modal
   * Useful for updating users or tags while modal is open
   */
  updateModalData(data: ModalData): void {
    this.modalDataSubject.next(data);
  }
}