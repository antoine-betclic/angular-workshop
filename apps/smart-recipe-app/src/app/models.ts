export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface RecipeModel {
  id: string;
  name: string;
  description: string;
  imgUrl: string;
  isFavorite: boolean;
  ingredients: Ingredient[];
}

export type RecipeDraft = Omit<RecipeModel, 'id' | 'isFavorite' | 'ingredients'>;