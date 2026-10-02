import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { RecipeService } from '../recipe';

@Component({
  selector: 'app-recipe-list',
  imports: [
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './recipe-list.html',
  styleUrl: './recipe-list.scss',
})
export class RecipeList {
  private readonly recipeService = inject(RecipeService);

  protected readonly title = signal('My Recipe Box');
  protected readonly searchTerm = signal('');
  protected readonly recipes = this.recipeService.getRecipes();
  protected readonly filteredRecipes = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    return this.recipes().filter((recipe) =>
      recipe.name.toLowerCase().includes(term),
    );
  });
}
