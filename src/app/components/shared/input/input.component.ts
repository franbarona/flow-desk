import { Component, signal, input, output, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  // Inputs
  type = input<InputType>('text');
  placeholder = input<string>('');
  label = input<string>('');
  hint = input<string>('');
  error = input<string>('');
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  maxlength = input<number | null>(null);
  min = input<number | null>(null);
  max = input<number | null>(null);
  step = input<number | null>(null);
  autocomplete = input<string>('off');

  // Outputs
  valueChange = output<string>();
  focus = output<FocusEvent>();
  blur = output<FocusEvent>();

  // State
  value = signal<string>('');
  isFocused = signal(false);
  isDisabled = signal(false);
  showPassword = signal(false);

  // ControlValueAccessor
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | number | null): void {
    this.value.set(value?.toString() ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  // Methods
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = target.value;
    
    this.value.set(newValue);
    this.onChange(newValue);
    this.valueChange.emit(newValue);
  }

  onFocus(event: FocusEvent): void {
    this.isFocused.set(true);
    this.focus.emit(event);
  }

  onBlur(event: FocusEvent): void {
    this.isFocused.set(false);
    this.onTouched();
    this.blur.emit(event);
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  getInputType(): string {
    if (this.type() === 'password' && this.showPassword()) {
      return 'text';
    }
    return this.type();
  }
}