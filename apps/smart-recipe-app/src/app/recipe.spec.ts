import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MOCK_RECIPES } from './mock-recipes';
import { RecipeService } from './recipe';

describe('RecipeService', () => {
  let service: RecipeService;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(RecipeService);
    httpTesting = TestBed.inject(HttpTestingController);

    TestBed.tick();
    httpTesting.expectOne('/api/recipes').flush(MOCK_RECIPES);
    await TestBed.inject(ApplicationRef).whenStable();
  });

  afterEach(() => httpTesting.verify());

  it('exposes the recipes from the api', () => {
    expect(service.getRecipes()()).toEqual(MOCK_RECIPES);
  });

  it('finds a recipe by id', () => {
    expect(service.getRecipeById('2')?.name).toBe('Caprese Salad');
    expect(service.getRecipeById('999')).toBeUndefined();
  });

  it('posts a new recipe and appends the saved one', async () => {
    const draft = {
      name: 'Tiramisu',
      description: 'Coffee-flavoured Italian dessert.',
      imgUrl: '',
      isFavorite: false,
      ingredients: [],
    };
    const pending = service.addRecipe(draft);

    const req = httpTesting.expectOne('/api/recipes');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(draft);
    req.flush({ ...draft, id: 'abc' });

    const added = await pending;
    expect(added.id).toBe('abc');
    expect(service.getRecipes()()).toHaveLength(3);
    expect(service.getRecipeById('abc')).toEqual(added);
  });
});
