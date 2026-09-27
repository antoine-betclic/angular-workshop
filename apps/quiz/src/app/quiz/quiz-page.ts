import { httpResource } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  linkedSignal,
  signal,
} from '@angular/core';
import { Quiz } from './quiz.model';

@Component({
  selector: 'qz-quiz-page',
  templateUrl: './quiz-page.html',
  styleUrl: './quiz-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizPage {
  protected readonly quiz = httpResource<Quiz>(() => '/api/quiz/1');
  protected readonly questions = computed(
    () => this.quiz.value()?.questions ?? [],
  );
  protected readonly index = signal(0);
  /** questionId → choiceId, figé au clic sur « Suivant ». */
  protected readonly answers = signal<Record<string, string>>({});

  protected readonly current = computed(() => this.questions()[this.index()]);
  protected readonly finished = computed(
    () =>
      this.questions().length > 0 && this.index() >= this.questions().length,
  );
  protected readonly locked = computed(() => {
    const question = this.current();
    return !!question && question.id in this.answers();
  });
  /** Choix en cours : réinitialisé à chaque changement de question. */
  protected readonly selected = linkedSignal<string | null>(() => {
    const question = this.current();
    return question ? (this.answers()[question.id] ?? null) : null;
  });

  protected next(): void {
    const question = this.current();
    const choice = this.selected();
    if (!question || choice === null) return;
    if (!this.locked()) {
      this.answers.update((answers) => ({ ...answers, [question.id]: choice }));
    }
    this.index.update((i) => i + 1);
  }

  protected previous(): void {
    this.index.update((i) => Math.max(0, i - 1));
  }
}
