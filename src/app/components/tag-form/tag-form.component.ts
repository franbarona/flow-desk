import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CreateTagRequest, Tag, UpdateTagRequest } from '../../models/tag.interface';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-tag-form',
  imports: [SharedModule, ReactiveFormsModule],
  templateUrl: './tag-form.component.html',
  styleUrl: './tag-form.component.scss',
})
export class TagFormComponent implements OnChanges {
  @Input() existingTag: Tag | null = null; // For editing existing tasks
  @Output() tagCreated = new EventEmitter<CreateTagRequest>();
  @Output() tagUpdated = new EventEmitter<UpdateTagRequest>();
  @Output() modalClosed = new EventEmitter<void>();

  tagForm: FormGroup;
  isEditMode = false;

  get currentColor() {
    return this.tagForm?.controls['color'].value;
  }

  constructor(private readonly fb: FormBuilder) {
    this.tagForm = this.createForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.existingTag) {
    console.log("existingTag", this.existingTag)
      this.isEditMode = true;
      this.populateFormWithTask(this.existingTag);
    } else {
      this.isEditMode = false;
      this.resetForm();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      color: [''],
    });
  }

  private populateFormWithTask(tag: Tag) {
    this.tagForm.patchValue({
      name: tag.name,
      color: tag.color
    });
  }

  private resetForm() {
    this.tagForm.reset();
  }

  onColorSelected (color: string) {
    this.tagForm.controls['color'].setValue(color)
  }

  onSubmit() {
    if (this.tagForm.valid) {
      const formValue = this.tagForm.value;

      if (this.isEditMode && this.existingTag) {
        // Update existing task
        const tagRequest: UpdateTagRequest = {
          id: this.existingTag.id,
          name: formValue.name,
          color: formValue.color
        };
        this.tagUpdated.emit(tagRequest);
      } else {
        // Create new task
        const tagRequest: CreateTagRequest = {
          name: formValue.name,
          color: formValue.color
        };
        this.tagCreated.emit(tagRequest);
      }

      this.closeModal();
    }
  }

  closeModal() {
    this.resetForm();
    this.isEditMode = false;
    this.modalClosed.emit();
  }

  // Validation helpers
  get nameErrors(): string | null {
    const control = this.tagForm.get('name');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Name is required';
    }
    return null;
  }


  get isFormValid(): boolean {
    return this.tagForm.valid;
  }
}
