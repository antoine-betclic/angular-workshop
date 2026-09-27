# Section « Ouvrir le capot : Chrome DevTools »

Durée cible : 25 à 35 minutes, défis compris. Les participants suivent sur leur poste.

## 1. Pré-requis

1. `pnpm demo` tourne (api `:3000`, `todo-zone` `:4200`, `todo-zoneless` `:4201`). Ce sont des builds de développement : l'onglet Angular n'apparaît pas sur un build de production.
2. Extension **Angular DevTools** installée (Chrome Web Store ou Firefox Add-ons).
3. Chrome à jour. Pour la piste Angular du panneau Performance, rien à installer : `ng.enableProfiling()` dans la console.
4. Pour **Override content**, prévoir un dossier vide (par exemple `~/devtools-overrides`) : Chrome demande l'autorisation d'y écrire la première fois.
5. Les mentions « En retard de N j » sont relatives à la date du jour : elles changent d'une répétition à l'autre, c'est normal.

## 2. Déroulé

| Slide                  | Geste                                                                          | À faire remarquer                                               |
| ---------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| Components             | `:4201/todos`, sélectionner `zl-todo-list`, déplier `store`, cliquer un filtre | les signaux du store se mettent à jour ; `$ng0` dans la console |
| Profiler               | Record sur `:4200/lab`, bouger la souris, Stop ; idem sur `:4201/lab`          | rafale de cycles d'un côté, rien de l'autre                     |
| Injector / Router Tree | ouvrir les deux onglets sur les deux apps                                      | NgModules lazy (injecteurs d'environnement) vs `Routes`         |
| Performance            | `ng.enableProfiling()`, Record, cliquer une case à cocher de `/todos`          | piste Angular, couleurs, `Change detection`                     |
| Throttling             | Network, Slow 4G, _Disable cache_, recharger `/todos/new`                      | « Chargement des tags… » dans les deux apps                     |
| Override               | clic droit sur `GET /todos` → Override content, changer un titre, recharger    | point violet, zéro redémarrage                                  |
| Block                  | clic droit → Block request URL, recharger                                      | message d'erreur différent selon l'app                          |
| CSS                    | `⌘⇧C` sur une tâche en retard, Styles, Computed                                | la règle `.todo-item.overdue`, le lien vers `index.scss`        |

## 3. Prise en main

Les 4 exercices de la slide « À vous : prise en main en binôme ». Les réponses sont données à l'oral.

1. **Profiler** : combien de cycles de change detection pour un clic sur le bouton de réinitialisation du labo, sur `:4200/lab` puis `:4201/lab` ?
2. **Override** : faire renvoyer `"dueDate": null` à `GET /todos`. Que se passe-t-il dans chaque app ?
3. **Throttling** : Slow 4G + _Disable cache_. Combien de ko transférés avant que `/todos` s'affiche, sur chaque app ?
4. **CSS** : pourquoi « Passer les composants en OnPush » a-t-elle une bordure rouge ? Quelle règle, quel fichier ?

## 4. Plan B

Les captures des slides viennent de deux sources :

- `apps/slides/public/devtools/ng-*.png` et `cr-*.png` : documentation officielle (angular.dev et developer.chrome.com, licence CC BY 4.0).
- Les autres : captures des deux apps de ce dépôt (mock de `/todos`, requête bloquée, réseau ralenti, survol CSS, Paint flashing).

Si une démo ne répond pas, dérouler les slides : chaque geste y est illustré.
