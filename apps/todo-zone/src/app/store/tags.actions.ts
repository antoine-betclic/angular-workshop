import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Tag } from '@angular-workshop/shared/models';

export const TagsActions = createActionGroup({
  source: 'Tags',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ tags: Tag[] }>(),
    'Load Failure': props<{ error: string }>(),
  },
});
