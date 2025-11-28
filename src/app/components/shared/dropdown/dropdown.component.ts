import {
  Component,
  signal,
  computed,
  output,
  input,
  forwardRef,
  contentChild,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './dropdown.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent<T> implements ControlValueAccessor {
  // Inputs
  options = input.required<T[]>();
  placeholder = input<string>('Select');
  labelKey = input<keyof T | null>(null);
  valueKey = input<keyof T | null>(null);

  // Template personalizado para las opciones
  optionTemplate = contentChild<TemplateRef<{ $implicit: T }>>('optionTemplate');

  // Outputs
  selectionChange = output<T | null>();

  // State
  isOpen = signal(false);
  selectedValue = signal<T | null>(null);

  // Computed
  displayValue = computed(() => {
    const selected = this.selectedValue();
    if (!selected) return '';

    const label = this.labelKey();
    if (label && typeof selected === 'object' && selected !== null) {
      return String((selected as Record<string, unknown>)[label as string]);
    }
    return String(selected);
  });

  // ControlValueAccessor
  private onChange: (value: T | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: T | null): void {
    if (value === null || value === undefined) {
      this.selectedValue.set(null);
      return;
    }

    // Si el valor es primitivo y tenemos valueKey, buscar el objeto completo
    const vKey = this.valueKey();
    if (vKey && typeof value !== 'object') {
      const found = this.options().find(
        (opt) => (opt as Record<string, unknown>)[vKey as string] === value
      );
      this.selectedValue.set(found ?? null);
    } else {
      this.selectedValue.set(value);
    }
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Methods
  toggle(): void {
    this.isOpen.update((v) => !v);
  }

  close(): void {
    this.isOpen.set(false);
    this.onTouched();
  }

  selectOption(option: T): void {
    this.selectedValue.set(option);

    const vKey = this.valueKey();
    const emitValue =
      vKey && typeof option === 'object' && option !== null
        ? (option as Record<string, unknown>)[vKey as string]
        : option;

    this.onChange(emitValue as T);
    this.selectionChange.emit(option);
    this.close();
  }

  clear(): void {
    this.selectedValue.set(null);
    this.onChange(null);
    this.selectionChange.emit(null);
    this.close();
  }

  getOptionLabel(option: T): string {
    const label = this.labelKey();
    if (label && typeof option === 'object' && option !== null) {
      return String((option as Record<string, unknown>)[label as string]);
    }
    return String(option);
  }

  isSelected(option: T): boolean {
    const selected = this.selectedValue();
    if (!selected) return false;

    const vKey = this.valueKey();
    if (vKey && typeof option === 'object' && option !== null && typeof selected === 'object') {
      return (
        (option as Record<string, unknown>)[vKey as string] ===
        (selected as Record<string, unknown>)[vKey as string]
      );
    }
    return option === selected;
  }
}
