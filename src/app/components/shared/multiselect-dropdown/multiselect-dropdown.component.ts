import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  OnInit,
  OnChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
  SimpleChanges,
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
  implements ControlValueAccessor, OnInit, OnChanges, AfterViewInit
{
  @Input() items: T[] = [];
  @Input() placeholder = 'Select...';
  @Input() displayLabel = true;
  @Output() selectionChange = new EventEmitter<string[]>();

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  selectedItems: T[] = [];
  filteredItems: T[] = [];
  searchText = '';
  isOpen = false;
  shouldFocusInput = false;

  // Almacena los IDs pendientes cuando writeValue se llama antes de que items esté disponible
  private pendingIds: string[] | null = null;

  // ControlValueAccessor
  private onChange: (value: string[]) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit() {
    this.filteredItems = [...this.items];
    this.processPendingIds();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['items'] && this.items.length > 0) {
      this.filteredItems = [...this.items];
      // Cuando los items cambian, intentamos procesar los IDs pendientes
      this.processPendingIds();
    }
  }

  ngAfterViewInit() {
    if (this.shouldFocusInput) {
      this.focusInput();
    }
  }

  /**
   * Procesa los IDs pendientes una vez que los items están disponibles
   */
  private processPendingIds(): void {
    if (this.pendingIds && this.items.length > 0) {
      this.selectedItems = this.mapIdsToItems(this.pendingIds);
      this.pendingIds = null;
    }
  }

  /**
   * Convierte un array de IDs en sus correspondientes objetos T
   */
  private mapIdsToItems(ids: string[]): T[] {
    if (!ids || ids.length === 0) {
      return [];
    }
    return this.items.filter((item) => ids.includes(item.id));
  }

  /**
   * Extrae los IDs de los items seleccionados
   */
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

  // ControlValueAccessor implementation

  /**
   * Recibe un array de IDs (string[]) y los mapea a los objetos correspondientes
   */
  writeValue(value: string[] | null): void {
    if (!value) {
      this.selectedItems = [];
      this.pendingIds = null;
      return;
    }

    // Si los items ya están cargados, mapeamos directamente
    if (this.items.length > 0) {
      this.selectedItems = this.mapIdsToItems(value);
    } else {
      // Si los items aún no están disponibles, guardamos los IDs para procesarlos después
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
    // To do
  }

  closeDropdown(): void {
    this.isOpen = false;
    this.filteredItems = [...this.items];
  }
}