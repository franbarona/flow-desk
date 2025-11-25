import { Component, Input, Output, EventEmitter, forwardRef, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface User {
  id: string | number;
  name: string;
  surnames: string;
  avatarUrl: string;
}

@Component({
  selector: 'app-multiselect-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
export class MultiselectDropdownComponent<T extends User> implements ControlValueAccessor, OnInit {
  @Input() items: T[] = [];
  @Input() placeholder = 'Seleccionar usuarios...';
  @Input() displayLabel = true;
  @Output() selectionChange = new EventEmitter<T[]>();

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  selectedItems: T[] = [];
  filteredItems: T[] = [];
  searchText = '';
  isOpen = false;

  // ControlValueAccessor
  private onChange: (value: T[]) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.filteredItems = [...this.items];
  }

  onSearchChange(text: string) {
    this.searchText = text;
    this.filteredItems = this.items.filter(item =>
      `${item.name} ${item.surnames}`.toLowerCase().includes(text.toLowerCase())
    );
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  isSelected(item: T): boolean {
    return this.selectedItems.some(selected => selected.id === item.id);
  }

  toggleItem(item: T) {
    if (this.isSelected(item)) {
      this.selectedItems = this.selectedItems.filter(selected => selected.id !== item.id);
    } else {
      this.selectedItems = [...this.selectedItems, item];
    }
    this.searchText = '';
    this.onSearchChange('');
    this.updateValue();
    
    // Marcar para detección de cambios y mantener focus
    this.cdr.markForCheck();
    setTimeout(() => {
      this.searchInput?.nativeElement?.focus();
    }, 0);
  }

  removeItem(item: T) {
    this.selectedItems = this.selectedItems.filter(selected => selected.id !== item.id);
    this.updateValue();
  }

  clearAll() {
    this.selectedItems = [];
    this.updateValue();
  }

  private updateValue() {
    this.onChange(this.selectedItems);
    this.onTouched();
    this.selectionChange.emit(this.selectedItems);
  }



  // ControlValueAccessor implementation
  writeValue(value: T[]): void {
    if (value) {
      this.selectedItems = value;
    }
  }

  registerOnChange(fn: (value: T[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Implementar si es necesario
  }
}