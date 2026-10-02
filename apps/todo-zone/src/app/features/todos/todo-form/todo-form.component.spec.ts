import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { SharedModule } from '../../../shared/shared.module';
import { selectAllTags, selectTagsLoaded } from '../../../store';
import { TodoFormComponent } from './todo-form.component';

describe('TodoFormComponent : validation conditionnelle', () => {
  function setup(): TodoFormComponent {
    TestBed.configureTestingModule({
      imports: [SharedModule, ReactiveFormsModule, RouterModule.forRoot([])],
      declarations: [TodoFormComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectTagsLoaded, value: true },
            { selector: selectAllTags, value: [] },
          ],
        }),
      ],
    });
    const fixture = TestBed.createComponent(TodoFormComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('branche puis débranche `required` sur la description selon la priorité', () => {
    const component = setup();
    const { description, priority } = component.form.controls;

    expect(component.descriptionRequired).toBe(false);
    expect(description.valid).toBe(true);

    priority.setValue('high');
    expect(component.descriptionRequired).toBe(true);
    expect(description.hasError('required')).toBe(true);

    priority.setValue('low');
    expect(component.descriptionRequired).toBe(false);
    expect(description.valid).toBe(true);
  });
});
