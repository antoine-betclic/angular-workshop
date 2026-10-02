import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { MOCK_RECIPES } from '../mock-recipes';
import { RecipeService } from '../recipe';
import { RecipeForm } from './recipe-form';

describe('RecipeForm', () => {
  let fixture: ComponentFixture<RecipeForm>;
  let element: HTMLElement;
  let service: RecipeService;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [RecipeForm],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    fixture = TestBed.createComponent(RecipeForm);
    element = fixture.nativeElement;
    service = TestBed.inject(RecipeService);
    httpTesting = TestBed.inject(HttpTestingController);
    TestBed.tick();
    httpTesting.expectOne('/api/recipes').flush(MOCK_RECIPES);
    await fixture.whenStable();
  });

  afterEach(() => httpTesting.verify());

  const type = (selector: string, value: string): void => {
    const field = element.querySelector(selector) as
      HTMLInputElement | HTMLTextAreaElement;
    field.value = value;
    field.dispatchEvent(new Event('input'));
  };

  const submit = async (): Promise<void> => {
    element.querySelector('form')?.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
  };

  it('does not add an invalid recipe and shows errors', async () => {
    await submit();

    expect(service.getRecipes()()).toHaveLength(2);
    expect(element.textContent).toContain('Recipe name is required.');
  });

  it('adds the recipe through the service and navigates to it', async () => {
    const navigate = vi
      .spyOn(TestBed.inject(Router), 'navigate')
      .mockResolvedValue(true);
    type('[formControlName="name"]', 'Tiramisu');
    type(
      '[formControlName="description"]',
      'Coffee-flavoured Italian dessert.',
    );

    element.querySelector('form')?.dispatchEvent(new Event('submit'));
    const req = httpTesting.expectOne('/api/recipes');
    expect(req.request.method).toBe('POST');
    req.flush({ ...req.request.body, id: '3' });
    await fixture.whenStable();

    expect(service.getRecipeById('3')).toMatchObject({
      name: 'Tiramisu',
      imgUrl: 'images/placeholder.svg',
      isFavorite: false,
    });
    expect(navigate).toHaveBeenCalledWith(['/recipes', '3']);
  });
});
