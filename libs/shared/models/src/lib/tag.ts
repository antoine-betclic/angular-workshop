/** Un tag tel que renvoyé par l'API json-server (`/tags`). */
export interface Tag {
  id: string;
  label: string;
  /** Couleur CSS (hex). */
  color: string;
}
