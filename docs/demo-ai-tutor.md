# Démo « Angular + IA » : MCP, skill `angular-developer`, AI Tutor

Durée cible : 8 à 10 minutes. Tout se joue depuis Claude Code (ou Gemini CLI / Cursor).

## 1. Ce qu'offre angular.dev/ai (à montrer dans le navigateur)

| Ressource | Rôle | Où |
| --- | --- | --- |
| `llms.txt` / `llms-full.txt` | Contexte compact de la doc pour un LLM | https://angular.dev/llms.txt, https://angular.dev/assets/context/llms-full.txt |
| Best practices | Fichier de règles à coller dans `CLAUDE.md` / `.cursorrules` | https://angular.dev/ai/develop-with-ai |
| Skill `angular-developer` | Skill agentique (SKILL.md + 40 références : signals, Signal Forms, httpResource, SSR, tests…) | https://github.com/angular/skills |
| Serveur MCP `angular-cli` | Outils exposés par la CLI à l'agent | `npx -y @angular/cli mcp` |
| AI Tutor | Cours interactif « Smart Recipe Box » (5 phases, 21 modules) piloté par le MCP | https://angular.dev/ai/ai-tutor |

Outils du serveur MCP : `ai_tutor`, `get_best_practices`, `search_documentation`, `list_projects`, `onpush_zoneless_migration`, `run_target`, `devserver.start` / `devserver.stop` / `devserver.wait_for_build`. Options : `--read-only`, `--local-only`.

## 2. Pré-requis (à faire avant la présentation)

1. Le skill est installé chez le présentateur : `npx skills add angular/skills` (il apparaît dans `~/.agents/skills/angular-developer`, lié dans `~/.claude/skills`). Vérifier avec `ls ~/.claude/skills/angular-developer`.
2. Le serveur MCP est déclaré dans `.mcp.json` à la racine du workspace (fait). Au premier lancement de `claude` dans le workspace, accepter le serveur `angular-cli`.
3. Le tutor fonctionne dans le workspace Nx (pas besoin d'`angular.json`) : il suffit d'une app Angular neuve, générée juste avant la démo (voir 3.3) et supprimée ensuite avec `pnpm nx g @nx/workspace:remove smart-recipe`.
4. Répéter une fois : le tutor génère beaucoup de texte, prévoir la taille de police du terminal.

## 3. Déroulé

### 3.1 Le skill (2 min)

Dans Claude Code, à la racine du workspace :

```text
/angular-developer quelle est la différence entre resource(), httpResource() et rxResource() ? Réponds en 5 lignes.
```

Montrer que la réponse cite les références du skill (pas d'hallucination d'API).

### 3.2 Le MCP (3 min)

```text
Avec le serveur MCP angular-cli, appelle get_best_practices et résume les 5 règles les plus importantes.
```

Puis la démo la plus parlante pour ce talk :

```text
Utilise l'outil onpush_zoneless_migration du MCP angular-cli sur apps/todo-zone/src/app/features/todos et propose un plan de migration vers OnPush puis zoneless. Ne modifie aucun fichier.
```

Attendu : l'outil analyse les composants `Default`, repère les mutations d'objets et propose l'ordre de migration (feuilles → racine). Comparer avec `apps/todo-zoneless`.

### 3.3 L'AI Tutor (4 min)

```bash
pnpm nx g @nx/angular:application apps/smart-recipe --prefix=sra
pnpm nx serve smart-recipe   # dans un second terminal : le tutor attend le live-reload
claude
```

Puis dans la session :

```text
launch the Angular AI tutor
```

Le tutor répond avec la table des matières. Enchaîner :

```text
Set my experience level to advanced
Show the table of contents
Jump to the Signal Forms lesson
```

Faire l'exercice proposé sur un composant, laisser le tutor relire le code (« automated code review »), montrer « give me a hint ».

Alternative si le MCP n'est pas chargé : taper `#angular-cli` puis coller `https://angular.dev/ai/ai-tutor`.

## 4. Plan B

- Le MCP ne démarre pas : lancer à la main `npx -y @angular/cli mcp --help` pour montrer les options, puis ouvrir https://angular.dev/ai/mcp.
- Le tutor ne se lance pas : ouvrir https://angular.dev/ai/ai-tutor et dérouler le curriculum (5 phases) à l'écran.
- Pas de réseau : `pnpm nx serve todo-zoneless` et montrer `apps/todo-zoneless/src/app/features/todos/todo-form.ts` comme exemple de ce que le tutor enseigne (Signal Forms).

## 5. Points à souligner

- L'IA ne remplace pas la connaissance du framework : le skill et le MCP servent surtout à **éviter les API obsolètes** (NgModules, `*ngIf`, `@Input()`…) que les modèles ont massivement vues à l'entraînement.
- `onpush_zoneless_migration` est exactement l'outil qui aurait servi à migrer `todo-zone` vers `todo-zoneless`.
- Le tutor est un LLM : il peut se tromper, versionner son code avec git à chaque module.
