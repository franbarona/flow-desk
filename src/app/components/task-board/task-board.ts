import { Component } from '@angular/core';
import { Card } from '../../models/card.interface';
import { CommonModule } from '@angular/common';
import { AddCardComponent } from '../add-card/add-card.component';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.html',
  styleUrls: ['./task-board.scss'],
  imports: [CommonModule, AddCardComponent],
})
export class TaskBoard {
  cards: Card[] = [
    // BACKLOG
    { title: "Look into render bug in dashboard", id: "1", column: "backlog" },
    { title: "SOX compliance checklist", id: "2", column: "backlog" },
    { title: "[SPIKE] Migrate to Azure", id: "3", column: "backlog" },
    { title: "Document Notifications service", id: "4", column: "backlog" },
    // TODO
    {
      title: "Research DB options for new microservice",
      id: "5",
      column: "todo",
    },
    { title: "Postmortem for outage", id: "6", column: "todo" },
    { title: "Sync with product on Q3 roadmap", id: "7", column: "todo" },
    // DOING
    {
      title: "Refactor context providers to use Zustand",
      id: "8",
      column: "doing",
    },
    { title: "Add logging to daily CRON", id: "9", column: "doing" },
    // DONE
    {
      title: "Set up DD dashboards for Lambda listener",
      id: "10",
      column: "done",
    },
  ];

  columns = [
    { 
      id: 'backlog', 
      title: 'BACKLOG', 
      headingColor: 'text-neutral-500' 
    },
    { 
      id: 'todo', 
      title: 'TODO', 
      headingColor: 'text-yellow-200' 
    },
    { 
      id: 'doing', 
      title: 'IN PROGRESS', 
      headingColor: 'text-blue-200' 
    },
    { 
      id: 'done', 
      title: 'COMPLETE', 
      headingColor: 'text-emerald-200' 
    }
  ];

  activeColumn: string | null = null;
  activeBurnBarrel: boolean = false;
  dragOverIndicator: string | null = null;
  cardPositions: Map<string, DOMRect> = new Map();
  isAnimating: boolean = false;

  getFilteredCards(column: string): Card[] {
    return this.cards.filter(card => card.column === column);
  }

  onDragStart(event: DragEvent, card: Card): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', card.id);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent, column?: string): void {
    event.preventDefault();
    if (column) {
      this.activeColumn = column;
      this.highlightIndicator(event, column);
    } else {
      this.activeBurnBarrel = true;
    }
  }

  onDragLeave(column?: string): void {
    if (column) {
      // Only clear if we're really leaving the column
      const target = event?.target as HTMLElement;
      const currentTarget = event?.currentTarget as HTMLElement;
      
      if (currentTarget && !currentTarget.contains(target)) {
        this.activeColumn = null;
        this.clearHighlights();
      }
    } else {
      this.activeBurnBarrel = false;
    }
  }

  onDrop(event: DragEvent, targetColumn?: string): void {
    event.preventDefault();
    const cardId = event.dataTransfer?.getData('text/plain');
    
    if (!cardId) return;

    if (targetColumn) {
      // Handle drop within column or between columns
      this.handleCardDrop(cardId, targetColumn, event);
      this.activeColumn = null;
    } else {
      // Delete card (burn barrel)
      this.deleteCard(cardId);
      this.activeBurnBarrel = false;
    }
    
    this.clearHighlights();
  }

  private handleCardDrop(cardId: string, targetColumn: string, event: DragEvent): void {
    // Capture positions before move
    this.captureCardPositions();
    
    const indicators = this.getIndicators(targetColumn);
    const { element } = this.getNearestIndicator(event, indicators);
    const beforeId = element?.dataset['before'] || "-1";

    if (beforeId === cardId) return; // Can't drop on itself

    let cardsCopy = [...this.cards];
    let cardToMove = cardsCopy.find(c => c.id === cardId);
    
    if (!cardToMove) return;

    // Update card column
    cardToMove = { ...cardToMove, column: targetColumn as any };
    
    // Remove card from current position
    cardsCopy = cardsCopy.filter(c => c.id !== cardId);

    if (beforeId === "-1") {
      // Drop at the end
      cardsCopy.push(cardToMove);
    } else {
      // Drop before specific card
      const insertIndex = cardsCopy.findIndex(c => c.id === beforeId);
      if (insertIndex >= 0) {
        cardsCopy.splice(insertIndex, 0, cardToMove);
      } else {
        cardsCopy.push(cardToMove);
      }
    }

    this.cards = cardsCopy;
    
    // Trigger layout animations after change
    setTimeout(() => this.animateLayoutChanges(), 0);
  }

  private captureCardPositions(): void {
    const cardElements = document.querySelectorAll('[data-card-id]');
    cardElements.forEach((element) => {
      const cardId = element.getAttribute('data-card-id');
      if (cardId) {
        this.cardPositions.set(cardId, element.getBoundingClientRect());
      }
    });
  }

  private animateLayoutChanges(): void {
    this.isAnimating = true;
    const cardElements = document.querySelectorAll('[data-card-id]');
    
    cardElements.forEach((element) => {
      const cardId = element.getAttribute('data-card-id');
      if (cardId && this.cardPositions.has(cardId)) {
        const oldRect = this.cardPositions.get(cardId)!;
        const newRect = element.getBoundingClientRect();
        
        const deltaY = oldRect.top - newRect.top;
        const deltaX = oldRect.left - newRect.left;
        
        if (Math.abs(deltaY) > 1 || Math.abs(deltaX) > 1) {
          // Apply initial transform
          (element as HTMLElement).style.transform = `translate(${deltaX}px, ${deltaY}px)`;
          (element as HTMLElement).style.transition = 'none';
          
          // Force reflow
          element.getBoundingClientRect();
          
          // Animate to final position
          (element as HTMLElement).style.transition = 'transform 300ms cubic-bezier(0.2, 0, 0.2, 1)';
          (element as HTMLElement).style.transform = 'translate(0, 0)';
          
          // Clean up after animation
          setTimeout(() => {
            (element as HTMLElement).style.transition = '';
            (element as HTMLElement).style.transform = '';
            this.isAnimating = false;
          }, 300);
        }
      }
    });
    
    this.cardPositions.clear();
  }

  private highlightIndicator(event: DragEvent, column: string): void {
    const indicators = this.getIndicators(column);
    this.clearHighlights();

    const nearest = this.getNearestIndicator(event, indicators);
    if (nearest.element) {
      nearest.element.style.opacity = "1";
      this.dragOverIndicator = nearest.element.dataset['before'] || null;
    }
  }

  private clearHighlights(): void {
    const allIndicators = document.querySelectorAll('[data-column]');
    allIndicators.forEach((indicator: Element) => {
      (indicator as HTMLElement).style.opacity = "0";
    });
    this.dragOverIndicator = null;
  }

  private getNearestIndicator(event: DragEvent, indicators: HTMLElement[]): { element: HTMLElement | null, offset: number } {
    const DISTANCE_OFFSET = 25;

    return indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = event.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1] || null,
      }
    );
  }

  private getIndicators(column: string): HTMLElement[] {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`)) as HTMLElement[];
  }

  private deleteCard(cardId: string): void {
    this.cards = this.cards.filter(card => card.id !== cardId);
  }

  addCard(column: string, title: string): void {
    const newCard: Card = {
      id: Math.random().toString(),
      title: title.trim(),
      column: column as any
    };
    this.cards = [...this.cards, newCard];
  }

  trackByCardId(index: number, card: Card): string {
    return card.id;
  }
}

