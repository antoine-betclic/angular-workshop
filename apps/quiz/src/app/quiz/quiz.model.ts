/** Payload de `GET /api/quiz/:id`. Volontairement sans les bonnes réponses : elles sont données à l'oral. */
export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export interface Question {
  id: string;
  label: string;
  choices: Choice[];
}

export interface Choice {
  id: string;
  label: string;
}
