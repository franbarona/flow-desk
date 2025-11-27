import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  OnInit,
  OnChanges,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  SimpleChanges,
  HostListener,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';
import { MultiselectDropdown } from '../../../models/utils.interface';

@Component({
  selector: 'app-multiselect-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './multiselect-dropdown.component.html',
  styleUrls: ['./multiselect-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiselectDropdownComponent),
      multi: true,
    },
  ],
})
export class MultiselectDropdownComponent<T extends MultiselectDropdown>
  implements ControlValueAccessor, OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @Input() items: T[] = [];
  @Input() placeholder = 'Select...';
  @Input() displayLabel = true;
  @Output() selectionChange = new EventEmitter<string[]>();

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  private readonly elementRef = inject(ElementRef);

  selectedItems: T[] = [];
  filteredItems: T[] = [];
  searchText = '';
  isOpen = false;
  shouldFocusInput = false;

  private pendingIds: string[] | null = null;
  private escapeListener: ((event: KeyboardEvent) => void) | null = null;

  // ControlValueAccessor
  private onChange: (value: string[]) => void = () => {};
  private onTouched: () => void = () => {};

  /**
   * Detecta clicks fuera del componente para cerrar el dropdown
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  ngOnInit() {
    this.filteredItems = [...this.items];
    this.processPendingIds();
    this.setupEscapeListener();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['items'] && this.items.length > 0) {
      this.filteredItems = [...this.items];
      this.processPendingIds();
    }
  }

  ngAfterViewInit() {
    if (this.shouldFocusInput) {
      this.focusInput();
    }
  }

  ngOnDestroy() {
    this.removeEscapeListener();
  }

  private setupEscapeListener(): void {
    this.escapeListener = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && this.isOpen) {
        event.stopPropagation();
        event.preventDefault();
        this.closeDropdown();
      }
    };
    document.addEventListener('keydown', this.escapeListener, true); // true = capture phase
  }

  private removeEscapeListener(): void {
    if (this.escapeListener) {
      document.removeEventListener('keydown', this.escapeListener, true);
      this.escapeListener = null;
    }
  }

  private processPendingIds(): void {
    if (this.pendingIds && this.items.length > 0) {
      this.selectedItems = this.mapIdsToItems(this.pendingIds);
      this.pendingIds = null;
    }
  }

  private mapIdsToItems(ids: string[]): T[] {
    if (!ids || ids.length === 0) {
      return [];
    }
    return this.items.filter((item) => ids.includes(item.id));
  }

  private getSelectedIds(): string[] {
    return this.selectedItems.map((item) => item.id);
  }

  private focusInput() {
    requestAnimationFrame(() => {
      this.searchInput?.nativeElement?.focus();
    });
  }

  onSearchChange(text: string) {
    this.searchText = text;
    this.filteredItems = this.items.filter((item) =>
      `${item.label} ${item.extraLabel}`.toLowerCase().includes(text.toLowerCase())
    );
  }

  toggleDropdown() {
    if (!this.isOpen) this.focusInput();
    this.isOpen = !this.isOpen;
  }

  isSelected(item: T): boolean {
    return this.selectedItems.some((selected) => selected.id === item.id);
  }

  toggleItem(item: T) {
    if (this.isSelected(item)) {
      this.selectedItems = this.selectedItems.filter((selected) => selected.id !== item.id);
    } else {
      this.selectedItems = [...this.selectedItems, item];
    }
    this.searchText = '';
    this.onSearchChange('');
    this.updateValue();

    this.shouldFocusInput = true;
    this.focusInput();
  }

  removeItem(item: T) {
    this.selectedItems = this.selectedItems.filter((selected) => selected.id !== item.id);
    this.updateValue();
  }

  clearAll() {
    this.selectedItems = [];
    this.updateValue();
  }

  private updateValue() {
    const selectedIds = this.getSelectedIds();
    this.onChange(selectedIds);
    this.onTouched();
    this.selectionChange.emit(selectedIds);
  }

  writeValue(value: string[] | null): void {
    if (!value) {
      this.selectedItems = [];
      this.pendingIds = null;
      return;
    }

    if (this.items.length > 0) {
      this.selectedItems = this.mapIdsToItems(value);
    } else {
      this.pendingIds = value;
    }
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // To do if is needed
  }

  closeDropdown(): void {
    this.isOpen = false;
    this.searchText = '';
    this.filteredItems = [...this.items];
    this.searchInput?.nativeElement?.blur();
  }
}
