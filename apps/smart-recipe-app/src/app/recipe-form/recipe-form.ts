import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { PLACEHOLDER_IMG_URL } from '../mock-recipes';
import { RecipeService } from '../recipe';

@Component({
  selector: 'app-recipe-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './recipe-form.html',
  styleUrl: './recipe-form.scss',
})
export class RecipeForm {
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  private readonly recipeService = inject(RecipeService);
  private readonly router = inject(Router);

  protected readonly recipeForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    imgUrl: [''],
  });

  protected async save(): Promise<void> {
    if (this.recipeForm.invalid) {
      this.recipeForm.markAllAsTouched();
      return;
    }

    const { name, description, imgUrl } = this.recipeForm.getRawValue();
    const recipe = await this.recipeService.addRecipe({
      name,
      description,
      imgUrl: imgUrl || PLACEHOLDER_IMG_URL,
      isFavorite: false,
      ingredients: [],
    });
    void this.router.navigate(['/recipes', recipe.id]);
  }
}
