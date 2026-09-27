import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TagsApiService } from '../core/tags-api.service';
import { TagsActions } from './tags.actions';

@Injectable()
export class TagsEffects {
  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TagsActions.load),
      switchMap(() => this.api.getAll()),
      map((tags) => TagsActions.loadSuccess({ tags })),
      catchError((err: Error) => of(TagsActions.loadFailure({ error: err.message }))),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly api: TagsApiService,
  ) {}
}
