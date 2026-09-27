import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizPage } from './quiz-page';
import { Quiz } from './quiz.model';

const QUIZ: Quiz = {
  id: '1',
  title: 'Quiz de test',
  questions: [
    {
      id: '1',
      label: 'Première question ?',
      choices: [
        { id: 'a', label: 'Réponse 1A' },
        { id: 'b', label: 'Réponse 1B' },
      ],
    },
    {
      id: '2',
      label: 'Deuxième question ?',
      choices: [
        { id: 'a', label: 'Réponse 2A' },
        { id: 'b', label: 'Réponse 2B' },
      ],
    },
  ],
};

describe('QuizPage', () => {
  let fixture: ComponentFixture<QuizPage>;
  let el: HTMLElement;

  const radios = () =>
    Array.from(el.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
  const button = (label: string) =>
    Array.from(el.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === label,
    ) as HTMLButtonElement;

  async function click(target: HTMLElement): Promise<void> {
    target.click();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(QuizPage);
    el = fixture.nativeElement;
    TestBed.tick();
    TestBed.inject(HttpTestingController).expectOne('/api/quiz/1').flush(QUIZ);
    await fixture.whenStable();
  });

  it('affiche la question courante et le nombre total de questions', () => {
    expect(el.textContent).toContain('Question 1 / 2');
    expect(el.textContent).toContain('Première question ?');
    expect(radios()).toHaveLength(2);
    expect(button('Précédent').disabled).toBe(true);
  });

  it('active « Suivant » seulement après un choix', async () => {
    expect(button('Suivant').disabled).toBe(true);

    await click(radios()[1]);

    expect(button('Suivant').disabled).toBe(false);
  });

  it('passe à la question suivante sans choix présélectionné', async () => {
    await click(radios()[1]);
    await click(button('Suivant'));

    expect(el.textContent).toContain('Question 2 / 2');
    expect(el.textContent).toContain('Deuxième question ?');
    expect(radios().some((r) => r.checked)).toBe(false);
  });

  it('une réponse validée ne peut plus être modifiée en revenant en arrière', async () => {
    await click(radios()[1]);
    await click(button('Suivant'));
    await click(button('Précédent'));

    expect(el.textContent).toContain('Question 1 / 2');
    expect(radios()[1].checked).toBe(true);
    expect(el.querySelector('fieldset')?.disabled).toBe(true);
    expect(button('Suivant').disabled).toBe(false);
  });

  it('affiche le récapitulatif des choix une fois toutes les questions répondues', async () => {
    await click(radios()[1]);
    await click(button('Suivant'));
    await click(radios()[0]);
    await click(button('Suivant'));

    expect(el.textContent).toContain('Récapitulatif');
    const recap = Array.from(el.querySelectorAll('.recap > li')).map((li) => ({
      question: li.querySelector('p')?.textContent?.trim(),
      choices: li.querySelectorAll('.recap-choices li').length,
      selected: Array.from(li.querySelectorAll('.selected')).map((s) =>
        s.firstChild?.textContent?.trim(),
      ),
    }));
    expect(recap).toEqual([
      { question: 'Première question ?', choices: 2, selected: ['Réponse 1B'] },
      { question: 'Deuxième question ?', choices: 2, selected: ['Réponse 2A'] },
    ]);
  });
});
