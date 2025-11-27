import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CreateTagRequest, Tag } from '../models/tag.interface';
import { UtilsService } from './utils.service';
import { MOCK_TAGS_DATA } from '../constants/mocks';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private readonly TAGS_STORAGE_KEY = 'tags';
  private readonly tagsSubject = new BehaviorSubject<Tag[]>(this.loadTagsFromStorage());
  private readonly utilsService = inject(UtilsService);
  tags$ = this.tagsSubject.asObservable();

  /**
   * Get all tags
   */
  getTags(): Observable<Tag[]> {
    return this.tags$;
  }

  /**
   * Get all tags (snapshot actual)
   */
  getTagsSnapshot(): Tag[] {
    return this.tagsSubject.value;
  }

  /**
   *Get tag by ID
   */
  getTagById(id: string): Tag | undefined {
    return this.tagsSubject.value.find((tag) => tag.id === id);
  }

  /**
   * Create new tag
   */
  createTag(createTagRequest: CreateTagRequest): Observable<Tag> {
    const newTag: Tag = {
      id: this.utilsService.generateId(),
      name: createTagRequest.name,
      color: createTagRequest.color,
    };

    const currentTags = this.tagsSubject.value;
    this.tagsSubject.next([...currentTags, newTag]);
    this.saveTagsToStorage();

    return of(newTag);
  }

  /**
   * Update current tag
   */
  updateTag(id: string, updates: Partial<Omit<Tag, 'id'>>): Observable<Tag | undefined> {
    const currentTags = this.tagsSubject.value;
    const tagIndex = currentTags.findIndex((tag) => tag.id === id);

    if (tagIndex === -1) {
      return of(undefined);
    }

    const updatedTag: Tag = {
      ...currentTags[tagIndex],
      ...updates,
    };

    const newTags = [
      ...currentTags.slice(0, tagIndex),
      updatedTag,
      ...currentTags.slice(tagIndex + 1),
    ];

    this.tagsSubject.next(newTags);
    this.saveTagsToStorage();

    return of(updatedTag);
  }

  /**
   * Delete tag
   */
  deleteTag(id: string): Observable<boolean> {
    const currentTags = this.tagsSubject.value;
    const filteredTags = currentTags.filter((tag) => tag.id !== id);

    if (filteredTags.length === currentTags.length) {
      return of(false); // Tag no encontrado
    }

    this.tagsSubject.next(filteredTags);
    this.saveTagsToStorage();

    return of(true);
  }

  /**
   * Clear all tags (util for testing)
   */
  clearAll(): void {
    this.tagsSubject.next([]);
    globalThis.localStorage.removeItem(this.TAGS_STORAGE_KEY);
  }

  // ============ PRIVATE METHODS ============

  private loadTagsFromStorage(): Tag[] {
    try {
      const stored = globalThis.localStorage?.getItem(this.TAGS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading tags from storage:', error);
      return [];
    }
  }

  private saveTagsToStorage(): void {
    try {
      globalThis.localStorage.setItem(this.TAGS_STORAGE_KEY, JSON.stringify(this.tagsSubject.value));
    } catch (error) {
      console.error('Error saving tags to storage:', error);
    }
  }

  initializeTagsSampleData(): void {
    for (const tag of MOCK_TAGS_DATA) {
      this.createTag(tag);
    }
  }
}
