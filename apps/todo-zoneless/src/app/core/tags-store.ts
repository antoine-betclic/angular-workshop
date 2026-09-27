import { httpResource } from '@angular/common/http';
import { Injectable, computed, inject } from '@angular/core';
import { Tag } from '@angular-workshop/shared/models';
import { API_URL } from './api-url';

/**
 * Les tags sont une lecture pure : `httpResource` suffit.
 * Pas de service, pas de subscribe : la requête part dès que l'URL est calculée,
 * et `value()` / `isLoading()` / `error()` sont des signals.
 */
@Injectable({ providedIn: 'root' })
export class TagsStore {
  private readonly api = inject(API_URL);

  readonly tags = httpResource<Tag[]>(() => `${this.api}/tags`, {
    defaultValue: [],
  });

  readonly byId = computed(
    () =>
      new Map(
        (this.tags.hasValue() ? this.tags.value() : []).map((tag) => [tag.id, tag]),
      ),
  );
}
