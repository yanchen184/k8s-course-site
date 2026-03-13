# Presenter Sync Deployment Runbook

This runbook turns the optional Cloudflare presenter sync module into a production-ready manual deployment for the GitHub Pages site.

## Scope and blast radius

- The main site remains deployed on GitHub Pages.
- The Cloudflare Worker only handles cross-browser presenter sync.
- If the Worker is unavailable, the site should fall back to same-browser sync instead of breaking the main presentation flow.

## Deployment parameters

Fill in these values before the first deploy:

| Name | Example | Notes |
| --- | --- | --- |
| `SITE_ORIGIN` | `https://<your-github-pages-domain>` | The public origin that is allowed to open browser websocket sessions. |
| `WORKER_BASE_URL` | `https://<your-worker-domain>` | The public Cloudflare Worker URL. |
| `WORKER_WEBSOCKET_URL` | `https://<your-worker-domain>/websocket` | The value injected into the Vite build. |
| `LOCAL_ORIGIN` | `http://localhost:5173` | Optional local frontend origin for manual validation. |
| `PRESENTER_CONTROL_TOKEN_TTL_SECONDS` | `28800` | Optional. Controls how long a control link remains valid for new connections. Existing control tabs stay connected until rotation or disconnect. |

## Prerequisites

- Cloudflare account access for Workers and Durable Objects.
- Wrangler authenticated on the machine that will deploy the Worker.
- GitHub repository admin access to update repository variables and rerun GitHub Actions.
- Node.js installed for the smoke test script and the Vite build.

## Local validation before production

1. Install the worker dependencies:

   ```bash
   cd cloudflare/presenter-sync
   npm install
   ```

2. Create a local `.dev.vars` from `.dev.vars.example` and set:

   ```dotenv
   ALLOWED_ORIGINS=http://localhost:5173,https://<your-github-pages-domain>
   PRESENTER_CONTROL_TOKEN_TTL_SECONDS=28800
   ```

3. Start the Worker locally:

   ```bash
   npm run dev
   ```

4. Start the frontend locally from the repository root:

   ```bash
   VITE_PRESENTATION_SYNC_MODE=auto \
   VITE_PRESENTATION_SYNC_URL=http://127.0.0.1:8787/websocket \
   npm run dev
   ```

5. Run the automated smoke test from `cloudflare/presenter-sync`:

   ```bash
   npm run smoke -- \
     --base-url http://127.0.0.1:8787 \
     --origin http://localhost:5173
   ```

## Manual production deployment

1. Deploy the Worker with the production allowlist:

   ```bash
   cd cloudflare/presenter-sync
   npx wrangler deploy \
     --var ALLOWED_ORIGINS:https://<your-github-pages-domain> \
     --var PRESENTER_CONTROL_TOKEN_TTL_SECONDS:28800
   ```

   If you manage vars in the Cloudflare dashboard, use `--keep-vars` on later deploys so Wrangler does not replace them.

2. Verify the health endpoint:

   ```bash
   curl -fsS https://<your-worker-domain>/health
   ```

3. Run the smoke test against the deployed Worker:

   ```bash
   npm run smoke -- \
     --base-url https://<your-worker-domain> \
     --origin https://<your-github-pages-domain> \
     --deny-origin https://example.com
   ```

4. Update the GitHub repository variables:

   - `VITE_PRESENTATION_SYNC_MODE=auto`
   - `VITE_PRESENTATION_SYNC_URL=https://<your-worker-domain>/websocket`

5. Re-run [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) so GitHub Pages rebuilds with the new values.

## Production validation checklist

After the Pages deployment finishes, validate in the browser:

1. Open the admin presentation page and start presenter mode.
2. Confirm the status reads cross-browser sync, not same-browser fallback.
3. Use `Copy audience URL` and open it in another browser or device.
4. Confirm the shared audience follows presenter navigation but cannot control slides.
5. Confirm the popup controller audience window still controls the presenter.
6. Temporarily break the worker URL in a local build or stop the local Worker and confirm the UI falls back to same-browser sync.
7. In the share dialog, use `Rotate Control Link` and confirm the previous control link stops controlling the presenter.

## Troubleshooting

| Symptom | Likely cause | Check |
| --- | --- | --- |
| `/health` is not `ok` | Worker deploy failed or wrong URL | Re-run `npx wrangler deploy` and verify the Worker URL. |
| Websocket smoke test fails with `Origin not allowed` | `ALLOWED_ORIGINS` is missing or wrong | Re-deploy with the correct `SITE_ORIGIN` value. |
| Pages still shows same-browser sync | GitHub repo vars were not updated or Pages was not rebuilt | Check repository variables and rerun the Pages workflow. |
| Shared audience link can control presenter | The control-token URL was shared instead of the read-only URL | Re-copy the `Copy audience URL` value from presenter mode. |
| Controller popup cannot control slides | Control token missing from the popup URL or websocket connection failed | Verify the popup URL contains `control=<token>` and rerun the smoke test. |

## Follow-up work after the first stable deploy

- Add GitHub Actions automation for Worker deploy after the manual path is stable.
- Add a staging Worker URL and a staging Pages build if deployment frequency increases.
- Add stronger authentication and abuse controls if the relay becomes internet-facing beyond classroom use.
