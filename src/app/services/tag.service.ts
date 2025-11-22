import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { customAlphabet } from 'nanoid';
import { Tag, TagRequest } from '../models/tag.interface';
import { MOCK_TAGS_DATA } from '../constants/mocks';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  tags$ = new BehaviorSubject<Tag[]>(MOCK_TAGS_DATA);

  get tagsValue(): Tag[] {
    return this.tags$.value;
  }

  getTags(): Observable<Tag[]> {
    return this.tags$.asObservable();
  }

  createTag(tagRequest: TagRequest): Observable<Tag> {
    const noZeroNanoid = customAlphabet('123456789', 6); //ABCDEFGHIJKLMNOPQRSTUVWXYZ
    const newTag: Tag = {
      id: noZeroNanoid(),
      name: tagRequest.name,
      color: tagRequest.color,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const currentTags = this.tags$.value;
    this.tags$.next([...currentTags, newTag]);

    return of(newTag);
  }

  updateTag(tagId: string, updates: Partial<Tag>): Observable<Tag | null> {
    const currentTags = this.tags$.value;
    const tagIndex = currentTags.findIndex((tag) => tag.id === tagId);

    if (tagIndex === -1) {
      return of(null);
    }

    const updatedTag = {
      ...currentTags[tagIndex],
      ...updates,
      updatedAt: new Date(),
    };

    const updatedTags = [...currentTags];
    updatedTags[tagIndex] = updatedTag;
    this.tags$.next(updatedTags);

    return of(updatedTag);
  }

  deleteTag(tagId: string): Observable<boolean> {
    const currentTags = this.tags$.value;
    const tagIndex = currentTags.findIndex((tag) => tag.id === tagId);

    if (tagIndex === -1) {
      return of(false);
    }

    const updatedTags = currentTags.filter((tag) => tag.id !== tagId);
    this.tags$.next(updatedTags);

    return of(true);
  }
}
