Deployment notes

- To ensure `vite` (a devDependency) is available during the build, set the environment variable `NPM_CONFIG_PRODUCTION=false` in your build service or CI.

Examples:
- Railpack / service env: add `NPM_CONFIG_PRODUCTION=false` to the service environment (see `railpack.env`).
- Docker: see `Dockerfile.example` which sets `ENV NPM_CONFIG_PRODUCTION=false` during the build stage.

Alternatively, move `vite` and `@vitejs/plugin-react` into `dependencies` in `project/package.json` if you prefer not to change build envs.
