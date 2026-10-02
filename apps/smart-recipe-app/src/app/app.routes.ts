import { Route } from '@angular/router';
import { RecipeDetail } from './recipe-detail/recipe-detail';
import { RecipeForm } from './recipe-form/recipe-form';
import { RecipeList } from './recipe-list/recipe-list';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'recipes' },
  { path: 'recipes', component: RecipeList, title: 'My Recipe Box' },
  { path: 'recipes/new', component: RecipeForm, title: 'New recipe' },
  { path: 'recipes/:id', component: RecipeDetail, title: 'Recipe' },
  { path: '**', redirectTo: 'recipes' },
];
