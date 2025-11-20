import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CreateProjectRequest, Project, UpdateProjectRequest } from '../../models/project.interface';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-project-form',
  imports: [SharedModule, ReactiveFormsModule],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss',
})
export class ProjectFormComponent implements OnChanges {
  @Input() existingProject: Project | null = null; // For editing existing tasks
  @Output() projectCreated = new EventEmitter<CreateProjectRequest>();
  @Output() projectUpdated = new EventEmitter<UpdateProjectRequest>();
  @Output() modalClosed = new EventEmitter<void>();

  projectForm: FormGroup;
  isEditMode = false;

  get currentColor() {
    return this.projectForm?.controls['color'].value;
  }

  constructor(private readonly fb: FormBuilder) {
    this.projectForm = this.createForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.existingProject) {
      this.isEditMode = true;
      this.populateFormWithTask(this.existingProject);
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

  private populateFormWithTask(project: Project) {
    this.projectForm.patchValue({
      name: project.name,
      color: project.color
    });
  }

  private resetForm() {
    this.projectForm.reset();
  }

  onColorSelected (color: string) {
    this.projectForm.controls['color'].setValue(color)
  }

  onSubmit() {
    if (this.projectForm.valid) {
      const formValue = this.projectForm.value;

      if (this.isEditMode && this.existingProject) {
        // Update existing task
        const projectRequest: UpdateProjectRequest = {
          id: this.existingProject.id,
          name: formValue.name,
          slug: formValue.name?.toLowerCase().replace(/\s+/g, '-'),
          color: formValue.color
        };
        this.projectUpdated.emit(projectRequest);
      } else {
        // Create new task
        const projectRequest: CreateProjectRequest = {
          name: formValue.name,
          slug: formValue.name?.toLowerCase().replace(/\s+/g, '-'),
          color: formValue.color
        };
        this.projectCreated.emit(projectRequest);
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
    const control = this.projectForm.get('name');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Name is required';
    }
    return null;
  }


  get isFormValid(): boolean {
    return this.projectForm.valid;
  }
}
