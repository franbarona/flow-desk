import { Component, Input, Output, EventEmitter, HostListener, ElementRef, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ContextMenuAction {
  action: () => void;
  label: string;
  icon?: string;
  disabled?: boolean;
  separator?: boolean;
}

@Component({
  selector: 'app-context-menu',
  standalone: true,
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss',
  imports: [CommonModule],
})
export class ContextMenuComponent implements OnInit, OnDestroy {
  @Input() actions: ContextMenuAction[] = [];
  @Input() isVisible = false;
  @Input() position = { x: 0, y: 0 };
  
  @Output() actionSelected = new EventEmitter<ContextMenuAction>();
  @Output() menuClosed = new EventEmitter<void>();

  private readonly elementRef = inject(ElementRef);

  ngOnInit() {
    // Ajustar posición si el menú se sale de la pantalla
    if (this.isVisible) {
      this.adjustPosition();
    }
  }

  ngOnDestroy() {
    // Cleanup si es necesario
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.isVisible && !this.elementRef.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePressed() {
    if (this.isVisible) {
      this.closeMenu();
    }
  }

  onActionClick(action: ContextMenuAction) {
    if (!action.disabled && !action.separator) {
      this.actionSelected.emit(action);
      this.closeMenu();
    }
  }

  closeMenu() {
    this.menuClosed.emit();
  }

  // trackByActionId(index: number, action: ContextMenuAction): string {
  //   return action.action;
  // }

  private adjustPosition() {
    setTimeout(() => {
      const menuElement = this.elementRef.nativeElement.querySelector('.fixed');
      if (!menuElement) return;

      const rect = menuElement.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let newX = this.position.x;
      let newY = this.position.y;

      // Ajustar posición X si se sale por la derecha
      if (this.position.x + rect.width > windowWidth) {
        newX = this.position.x - rect.width;
      }

      // Ajustar posición Y si se sale por abajo
      if (this.position.y + rect.height > windowHeight) {
        newY = this.position.y - rect.height;
      }

      // Asegurar que no se salga por arriba o por la izquierda
      newX = Math.max(8, newX);
      newY = Math.max(8, newY);

      if (newX !== this.position.x || newY !== this.position.y) {
        this.position = { x: newX, y: newY };
      }
    });
  }
}