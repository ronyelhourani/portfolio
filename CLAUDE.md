# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A personal portfolio site: plain static HTML/CSS/JS, no build tool, no bundler, no package manager at the root. Pages are opened directly in the browser to preview — there is no dev server or build step.

- `index.html` / `index.css` — homepage
- `aboutMe.html` / `aboutMe.css` — about page
- `common.css` / `commonScript.js` — shared styles and behavior (nav, accordion, smooth-scroll-to-section) used by every page
- `images/` — site assets
- `projects/web_design/` — static web design showcase (e.g. `ecommerce_wine/`), same plain HTML/CSS/JS pattern as the root
- `projects/qa/` — QA work showcases (billzer, restcountries, todolistme, twitter-clone-*): static HTML pages presenting manual test docs, Swagger/OpenAPI specs, and a JMeter script. These are display pages, not runnable apps.

Each showcase project under `projects/` is self-contained (its own HTML/CSS/JS/images) and does not share build tooling with the root site — new pages follow the same plain-file pattern, linking `common.css`/`commonScript.js` from the root via relative paths.

## Cypress QA suite (projects/qa/cypress)

A Cypress test suite written against third-party demo apps (billzer, restcountries, todolistme, twitter-clone) referenced by the QA showcase pages above. It is **display-only** — a portfolio artifact meant to be read as sample code, not executed. Do not run `npm install` / `cypress open` / `cypress run` against it; just edit the spec files as source when asked.

- Spec files live in `cypress/integration/<project>/*.js`.
- Fixtures under `cypress/fixtures/<project>/<endpoint>/` are per-endpoint mock DB snapshots (`twitter-clone-db.*.json`) referenced by the API tests.

## Commit message convention

`[Scope] short imperative description`, e.g. `[Home] add hover and focus effects`, `[AboutMe] change the profile picture`, `[RestCountries] fix the endpoint of test case 8`.

- Scope is the page or area touched: `Home`, `AboutMe`, `Common`, `common.css`, or a project name (`Billzer`, `RestCountries`, `Todolistme`, `Twitter-clone`).
- Description is a short imperative phrase, no trailing period.

## Git rules

Never run `git commit` until the user explicitly gives the order, even if changes are staged and ready.

## Workflow

For any request to add a feature, fix a bug, or change anything, follow these steps in order:

1. **Brainstorm** — ask whatever clarifying questions are needed until there's a shared understanding of the request.
2. **Plan** — lay out the intended changes before touching code.
3. **Implement** — make the changes.
4. **Manual review** — ask the user to review, and give them concrete steps to manually verify the change.
5. **Correct** — apply feedback and repeat step 4 until the user is happy.
6. **Commit** — only once the user explicitly asks for it (see Git rules above).
