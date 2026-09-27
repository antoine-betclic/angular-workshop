import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Tag } from '@angular-workshop/shared/models';
import { TagsActions } from './tags.actions';

export interface TagsState {
  tags: Tag[];
  loaded: boolean;
}

export const initialTagsState: TagsState = { tags: [], loaded: false };

export const tagsFeature = createFeature({
  name: 'tags',
  reducer: createReducer(
    initialTagsState,
    on(TagsActions.loadSuccess, (state, { tags }): TagsState => ({ ...state, tags, loaded: true })),
  ),
});

export const selectAllTags = tagsFeature.selectTags;
export const selectTagsLoaded = tagsFeature.selectLoaded;
export const selectTagsById = createSelector(
  selectAllTags,
  (tags): Record<string, Tag> => Object.fromEntries(tags.map((t) => [t.id, t])),
);
