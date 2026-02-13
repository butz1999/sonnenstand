# Repository Guidelines

## Project Requirements
- The file `anweisungen.md` contains the requirements and specifications for the sw project.
- Consider first having a discussion. DO NOT CODE ANYTHING before we discuss options and implementation strategy.
- Architecture first, implementation second.
- Always consider test driven development.

## Project Structure & Module Organization
The source of truth is `anweisungen.md`. Implement as a static webpage for Home Assistant WebView embedding.

Recommended layout:
- `www/index.html`: entry page that works directly via `file://` and in HA WebView.
- `www/assets/css/`: chart and layout styles.
- `www/assets/js/`: sun position logic, chart rendering, and timed updates.
- `www/assets/data/` (optional): precomputed sun-path datasets (solstices/equinox lines).

Keep solar calculations and drawing code separate from UI/config values.

## Build, Test, and Development Commands
No build system is required.
- Open `index.html` directly in a browser for the baseline test (must run without web server).
- Optional local server for debugging only: `python3 -m http.server 8000`.
- If npm tooling is added later, expose commands through `package.json` scripts.

## Coding Style & Naming Conventions
- Use HTML/CSS/vanilla JS with 2-space indentation.
- JS naming: `camelCase` for functions/variables, `UPPER_SNAKE_CASE` for constants.
- Filenames: lowercase kebab-case (example: `sun-chart-renderer.js`).
- Centralize tunables in one config object: location string (`"47.251738, 8.765695"`), colors, line widths, aspect ratio, and refresh interval (`15000` ms).
- Axis labels must follow the requirement: x = azimuth `[°]`, y = elevation `[°]`.

## Testing Guidelines
Automated tests are not configured; perform manual checks:
- Verify current time is auto-detected and current sun position is shown as a colored moving point.
- Verify update interval is about every 15 seconds.
- Verify fine grid lines and expected day-path lines (including solstice/equinox data if present).
- Verify fixed chart aspect ratio scales cleanly on desktop and mobile.

## Commit & Pull Request Guidelines
Follow Conventional Commits:
- `feat(chart): add 15s sun marker refresh`
- `fix(layout): preserve chart aspect ratio on mobile`

PRs should include: scope, requirement mapping to `anweisungen.md`, manual test steps, and screenshot(s) of the rendered chart.

## Security & Configuration Tips
- Do not introduce external API dependencies for core rendering.
- Keep configuration local and explicit; avoid secrets/tokens entirely.
- Prefer deterministic client-side calculations so HA embedding remains reliable offline.

## General Procedure
- Do the planning first and avoid coding before planning.
- Always ask if you are uncertain and do not assume anything.