# api — json-server

Backend factice partagé par `todo-zone`, `todo-zoneless`, `quiz` et `smart-recipe-app`.

- `pnpm nx serve api` : démarre json-server sur http://localhost:3000 (`/todos`, `/tags`, `/quiz`, `/recipes`).
- `pnpm nx run api:reset` : restaure `db.json` depuis `db.seed.json` (à faire avant chaque démo).

`db.json` est modifié par les apps (POST/PATCH/DELETE) et ignoré par git ; seul `db.seed.json` est versionné.
