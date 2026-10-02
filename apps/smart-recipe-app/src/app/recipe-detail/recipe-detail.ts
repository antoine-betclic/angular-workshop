import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { Ingredient } from '../models';
import { RecipeService } from '../recipe';

@Component({
  selector: 'app-recipe-detail',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.scss',
})
export class RecipeDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly recipeService = inject(RecipeService);

  private readonly recipeId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('id') ?? '' },
  );

  protected readonly recipe = computed(() =>
    this.recipeService.getRecipeById(this.recipeId()),
  );
  protected readonly servings = signal(1);
  protected readonly adjustedIngredients = computed<Ingredient[]>(() =>
    (this.recipe()?.ingredients ?? []).map((ingredient) => ({
      ...ingredient,
      quantity: ingredient.quantity * this.servings(),
    })),
  );

  protected increaseServings(): void {
    this.servings.update((servings) => servings + 1);
  }

  protected decreaseServings(): void {
    this.servings.update((servings) => Math.max(1, servings - 1));
  }
}
