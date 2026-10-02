import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { MOCK_RECIPES } from '../mock-recipes';
import { RecipeDetail } from './recipe-detail';

describe('RecipeDetail', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'recipes/:id', component: RecipeDetail }]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    harness = await RouterTestingHarness.create();
  });

  const navigate = async (url: string): Promise<void> => {
    await harness.navigateByUrl(url);
    TestBed.inject(HttpTestingController)
      .expectOne('/api/recipes')
      .flush(MOCK_RECIPES);
    await harness.fixture.whenStable();
  };

  const element = (): HTMLElement => harness.routeNativeElement as HTMLElement;
  const quantities = (): string[] =>
    Array.from(element().querySelectorAll('.quantity')).map(
      (el) => el.textContent?.trim() ?? '',
    );

  it('displays the recipe matching the route id', async () => {
    await navigate('/recipes/2');
    expect(element().querySelector('h1')?.textContent).toContain(
      'Caprese Salad',
    );
    expect(quantities()[0]).toBe('4 each');
  });

  it('scales ingredient quantities with the servings', async () => {
    await navigate('/recipes/1');
    const increase = element().querySelector<HTMLButtonElement>(
      'button[aria-label="Increase servings"]',
    );
    increase?.click();
    await harness.fixture.whenStable();

    expect(quantities()[0]).toBe('400 g');
  });

  it('shows a message for an unknown recipe', async () => {
    await navigate('/recipes/999');
    expect(element().textContent).toContain('Recipe not found.');
  });
});
