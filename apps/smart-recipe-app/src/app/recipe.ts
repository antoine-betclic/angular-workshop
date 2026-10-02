import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Service, Signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { RecipeModel } from './models';

const RECIPES_URL = '/api/recipes';

@Service()
export class RecipeService {
  private readonly http = inject(HttpClient);
  private readonly recipesResource = httpResource<RecipeModel[]>(
    () => RECIPES_URL,
    { defaultValue: [] },
  );
  // value() throws while the resource is in error state.
  private readonly recipes = computed(() =>
    this.recipesResource.hasValue() ? this.recipesResource.value() : [],
  );

  getRecipes(): Signal<RecipeModel[]> {
    return this.recipes;
  }

  getRecipeById(id: string): RecipeModel | undefined {
    return this.recipes().find((recipe) => recipe.id === id);
  }

  async addRecipe(newRecipe: Omit<RecipeModel, 'id'>): Promise<RecipeModel> {
    const recipe = await firstValueFrom(
      this.http.post<RecipeModel>(RECIPES_URL, newRecipe),
    );
    this.recipesResource.update((recipes) => [...(recipes ?? []), recipe]);
    return recipe;
  }
}
