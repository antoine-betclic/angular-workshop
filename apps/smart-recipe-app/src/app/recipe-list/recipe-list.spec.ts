import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MOCK_RECIPES } from '../mock-recipes';
import { RecipeList } from './recipe-list';

describe('RecipeList', () => {
  let fixture: ComponentFixture<RecipeList>;
  let element: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [RecipeList],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    fixture = TestBed.createComponent(RecipeList);
    element = fixture.nativeElement;
    TestBed.tick();
    TestBed.inject(HttpTestingController)
      .expectOne('/api/recipes')
      .flush(MOCK_RECIPES);
    await fixture.whenStable();
  });

  const recipeNames = (): string[] =>
    Array.from(element.querySelectorAll('.recipe .name')).map(
      (el) => el.textContent?.trim() ?? '',
    );

  it('lists every recipe with a link to its detail page', () => {
    expect(recipeNames()).toEqual(['Spaghetti Carbonara', 'Caprese Salad']);
    expect(element.querySelector('.recipe')?.getAttribute('href')).toBe(
      '/recipes/1',
    );
  });

  it('marks favorite recipes with a star', () => {
    expect(element.querySelectorAll('.favorite')).toHaveLength(1);
  });

  it('filters recipes from the search input', async () => {
    const input = element.querySelector('input') as HTMLInputElement;
    input.value = 'capr';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(recipeNames()).toEqual(['Caprese Salad']);
  });
});
