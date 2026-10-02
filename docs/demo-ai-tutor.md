# Démo « Angular + IA » : MCP, skill `angular-developer`, AI Tutor

Tout se joue depuis Claude Code (ou Gemini CLI / Cursor).

## 1. Ce qu'offre angular.dev/ai (à montrer dans le navigateur)

| Ressource | Rôle | Où |
| --- | --- | --- |
| `llms.txt` / `llms-full.txt` | Contexte compact de la doc pour un LLM | https://angular.dev/llms.txt, https://angular.dev/assets/context/llms-full.txt |
| Best practices | Fichier de règles à coller dans `CLAUDE.md` / `.cursorrules` | https://angular.dev/ai/develop-with-ai |
| Skill `angular-developer` | Skill agentique (SKILL.md + 40 références : signals, Signal Forms, httpResource, SSR, tests…) | https://github.com/angular/skills |
| Serveur MCP `angular-cli` | Outils exposés par la CLI à l'agent | `npx -y @angular/cli mcp` |
| AI Tutor | Cours interactif « Smart Recipe Box » (5 phases, 21 modules) piloté par le MCP | https://angular.dev/ai/ai-tutor |

Outils du serveur MCP : `ai_tutor`, `get_best_practices`, `search_documentation`, `list_projects`, `onpush_zoneless_migration`, `run_target`, `devserver_start` / `devserver_stop` / `devserver_wait_for_build`. Options : `--read-only`, `--local-only`.

## 2. Pré-requis (à faire avant la présentation)

1. Le skill est installé chez le présentateur : `npx skills add angular/skills` (il apparaît dans `~/.agents/skills/angular-developer`, lié dans `~/.claude/skills`). Vérifier avec `ls ~/.claude/skills/angular-developer`.
2. Le serveur MCP est déclaré dans `.mcp.json` à la racine du workspace (fait). Au premier lancement de `claude` dans le workspace, accepter le serveur `angular-cli`.
3. Le tutor fonctionne dans le workspace Nx (pas besoin d'`angular.json`). L'app `apps/smart-recipe-app` est déjà générée et amenée à la **fin de la phase 4** (modules 1 à 17 auto-complétés par le tutor via « Jump to the Signal Forms lesson ») : il ne reste que la phase 5. Entre deux répétitions, revenir à cet état avec `git restore apps/smart-recipe-app && git clean -fd apps/smart-recipe-app` : `git restore` seul ne supprime pas le composant `add-recipe/` créé pendant l'exercice, et le tutor le détecterait (checkpoints 18b à 18d) au lancement suivant.
4. Répéter une fois : le tutor génère beaucoup de texte, prévoir la taille de police du terminal.

## 3. Déroulé

### 3.1 Le skill

Dans Claude Code, à la racine du workspace :

```text
/angular-developer quelle est la différence entre resource(), httpResource() et rxResource() ? Réponds en 5 lignes.
```

Montrer que la réponse cite les références du skill (pas d'hallucination d'API).

### 3.2 Le MCP

```text
Avec le serveur MCP angular-cli, appelle get_best_practices et résume les 5 règles les plus importantes.
```

Puis la démo la plus parlante pour ce talk :

```text
Utilise l'outil onpush_zoneless_migration du MCP angular-cli sur apps/todo-zone/src/app/features/todos et propose un plan de migration vers OnPush puis zoneless. Ne modifie aucun fichier.
```

Attendu : l'outil analyse les composants `Default`, repère les mutations d'objets et propose l'ordre de migration (feuilles → racine). Comparer avec `apps/todo-zoneless`.

### 3.3 L'AI Tutor

Point de départ : `apps/smart-recipe-app` (port 4203) contient déjà l'état « fin du module 17 » :

| Phases 1 à 4 | Où |
| --- | --- |
| `models.ts` (`RecipeModel`, `Ingredient`), `mock-recipes.ts` (`MOCK_RECIPES`) | `src/app/` |
| `RecipeService` (`@Service()` v22, signal `recipes`, `getRecipeById`, `addRecipe`) | `src/app/recipe.ts` |
| Liste : recherche `[ngModel]`/`(ngModelChange)` + `computed`, `@for`, `@if` favori, `routerLink` | `src/app/recipe-list/` |
| Détail : `ActivatedRoute`, `servings.update()`, `adjustedIngredients` `computed` | `src/app/recipe-detail/` |
| Formulaire Reactive Forms (module 16), Material (module 17) | `src/app/recipe-form/` (`/recipes/new`) |

```bash
pnpm recipe   # dans un second terminal : le tutor attend le live-reload
claude
```

Puis dans la session (le prompt cible l'app, sinon le tutor peut analyser `todo-zone` ou `todo-zoneless`) :

```text
Launch the Angular AI tutor on apps/smart-recipe-app (served on http://localhost:4203). Modules 1 to 17 are done: start at Module 18 (Introduction to Signal Forms).
```

1. Le tutor annonce son analyse, puis **demande le niveau d'expérience** : répondre `2` (débutant, explications complètes, adaptées au public).
2. Il introduit la **Phase 5** avec l'avertissement « experimental / subject to change », puis le module 18.
3. Si l'analyse dérive malgré tout, une seule relance :

| Réaction du tutor | Réponse |
| --- | --- |
| Affiche toute la table des matières sans repère (« custom changes or jumped around ») | `Module 18` |
| Message « you've completed all phases! » (sa règle 7 considère le module 17 comme le dernier) | `Continue with Phase 5: Signal Forms, Module 18` |
| Propose d'auto-compléter des modules précédents | `No, modules 1-17 are done, start Module 18` |

Le module 18 ajoute `authorEmail` au modèle (le tutor donne le code de `models.ts` et `mock-recipes.ts` à coller) et fait créer un composant `AddRecipe` avec `form()` : idéal pour le comparer, côte à côte, au `RecipeForm` Reactive Forms existant. Faire l'exercice, laisser le tutor relire le code, montrer « give me a hint ». Modules suivants : `submit()` + reset (19), `required`/`email` (20), `errors()` (21).

**Décalage de version, corrigé automatiquement.** Le curriculum du tutor enseigne `imports: [Field]` + `[field]`, qui ne compile plus en Angular 22 : la directive s'appelle `FormField` / `[formField]` (`Field` n'est plus qu'un type). Le `CLAUDE.md` du workspace demande à Claude de corriger d'office et de le signaler en une phrase. À souligner devant le public : c'est exactement le rôle du contexte projet face à un modèle (ou un cours) en retard d'une version.

Alternative si le MCP n'est pas chargé : vérifier avec `/mcp` (serveur `angular-cli`), puis demander à Claude de lire `https://angular.dev/ai/ai-tutor`.

## 4. Plan B

- Le MCP ne démarre pas : lancer à la main `npx -y @angular/cli mcp --help` pour montrer les options, puis ouvrir https://angular.dev/ai/mcp.
- Le tutor ne se lance pas : ouvrir https://angular.dev/ai/ai-tutor et dérouler le curriculum (5 phases) à l'écran.
- Pas de réseau : `pnpm nx serve todo-zoneless` et montrer `apps/todo-zoneless/src/app/features/todos/todo-form.ts` comme exemple de ce que le tutor enseigne (Signal Forms).

## 5. Points à souligner

- L'IA ne remplace pas la connaissance du framework : le skill et le MCP servent surtout à **éviter les API obsolètes** (NgModules, `*ngIf`, `@Input()`…) que les modèles ont massivement vues à l'entraînement.
- `onpush_zoneless_migration` est exactement l'outil qui aurait servi à migrer `todo-zone` vers `todo-zoneless`.
- Le tutor est un LLM : il peut se tromper, versionner son code avec git à chaque module.
