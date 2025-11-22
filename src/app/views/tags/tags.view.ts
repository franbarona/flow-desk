import { Component, inject, OnInit } from '@angular/core';
import { TagService } from '../../services/tag.service';
import { Subject, takeUntil } from 'rxjs';
import {
  CreateTagRequest,
  Tag,
  UpdateTagRequest,
} from '../../models/tag.interface';
import { TagsTableComponent } from '../../components/tags-table/tags-table.component';
import { TagFormComponent } from '../../components/tag-form/tag-form.component';
import { ModalService } from '../../services/modal.service';
import { SharedModule } from '../../components/shared/shared.module';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.view.html',
  imports: [SharedModule, TagsTableComponent, TagFormComponent],
})
export class TagsView implements OnInit {
  private readonly tagService = inject(TagService);
  private readonly modalService = inject(ModalService);
  private readonly destroy$ = new Subject<void>();
  tags: Tag[] = [];
  selectedTag: Tag | null = null;
  modalAction: 'upsert' | 'delete' | null = null;

  get isModalOpen() {
    return this.modalService.isModalOpen;
  }

  ngOnInit(): void {
    // Load initial data
    this.tagService
      .getTags()
      .pipe(takeUntil(this.destroy$))
      .subscribe((tags) => (this.tags = tags));
  }

  addNewTag() {
    this.modalAction = 'upsert';
    this.modalService.openModal();
  }

  openTagModal(tag: Tag, event?: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.selectedTag = { ...tag };
    this.modalAction = 'upsert';
    this.modalService.openModal();
  }

  deleteConfirmationModal(tag: Tag, event?: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.selectedTag = { ...tag };
    this.modalAction = 'delete';
    this.modalService.openModal();
  }

  /**
   * Handles creation of new tags
   */
  onHandleCreatTag(tagRequest: CreateTagRequest) {
    this.tagService
      .createTag(tagRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newTag) => {
          console.log('Tag created successfully:', newTag);
          // You can add a success notification here
        },
        error: (error) => {
          console.error('Error creating tag:', error);
          // You can add error handling/notification here
        },
      });
  }

  onHandleUpdateTag(updatedTag: UpdateTagRequest) {
    const tagId = updatedTag.id;
    const updatedTagData: Partial<Tag> = {
      name: updatedTag.name,
      color: updatedTag.color,
    };
    this.tagService
      .updateTag(tagId, updatedTagData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newTag) => {
          console.log('Tag updated successfully:', newTag);
        },
        error: (error) => {
          console.error('Error creating tag:', error);
        },
      });
  }

  handleDeleteTag() {
    const tagId = this.selectedTag?.id;
    if (!tagId) return;
    this.tagService
      .deleteTag(tagId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('Tag deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting tag:', error);
        },
      });
    this.closeModal();
  }

  closeModal() {
    this.selectedTag = null;
    this.modalAction = null;
    this.modalService.closeModal();
  }
}
