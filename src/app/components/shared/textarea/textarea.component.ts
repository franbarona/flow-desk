import { Component, signal, input, output, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './textarea.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})
export class TextareaComponent implements ControlValueAccessor {
  // Inputs
  placeholder = input<string>('');
  label = input<string>('');
  hint = input<string>('');
  error = input<string>('');
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  maxlength = input<number | null>(null);
  rows = input<number>(4);
  resize = input<'none' | 'vertical' | 'horizontal' | 'both'>('vertical');
  showCounter = input<boolean>(false);

  // Outputs
  valueChange = output<string>();
  focus = output<FocusEvent>();
  blur = output<FocusEvent>();

  // State
  value = signal<string>('');
  isFocused = signal(false);
  isDisabled = signal(false);

  // ControlValueAccessor
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
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
    const target = event.target as HTMLTextAreaElement;
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

  getResizeClass(): string {
    const resizeMap = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };
    return resizeMap[this.resize()];
  }
}