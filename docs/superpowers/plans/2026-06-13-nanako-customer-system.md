# Honcho Chinese Customer System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing izakaya demo into a Honcho-area Chinese restaurant QR ordering, kitchen, checkout, and admin demo using a provisional public name.

**Architecture:** Keep the static local-first architecture. Change seed data, i18n strings, page titles, and small UI render helpers so the same pages become a customer-specific prototype.

**Tech Stack:** Static HTML, plain CSS, vanilla JavaScript, Node-based tests, Python http.server for preview.

---

### Task 1: Customer Seed Data

**Files:**
- Modify: `assets/izakaya-core.js`
- Modify: `tests/izakaya-core.test.js`

- [x] Write tests that require provisional customer metadata, Chinese restaurant categories, cash-first payment config, 3500 円食べ飲み放題, 680 円晩酌セット, 790 円麺, and representative dishes.
- [x] Run `node tests/izakaya-core.test.js` and verify the test fails before production code changes.
- [x] Replace the generic izakaya seed with Honcho Chinese categories, menu, tables, and settings.
- [x] Run `node tests/izakaya-core.test.js` and verify it passes.

### Task 2: Customer Copy And Language

**Files:**
- Modify: `assets/izakaya-i18n.js`
- Modify: `tests/izakaya-i18n.test.js`
- Modify: `order/index.html`
- Modify: `kitchen/index.html`
- Modify: `checkout/index.html`
- Modify: `admin/index.html`

- [x] Write tests that require provisional brand strings and cash-first checkout copy in Japanese, Chinese, and English.
- [x] Run `node tests/izakaya-i18n.test.js` and verify the test fails before production code changes.
- [x] Update language dictionaries and page titles/brands.
- [x] Run `node tests/izakaya-i18n.test.js` and verify it passes.

### Task 3: UI Customer Fit

**Files:**
- Modify: `assets/izakaya-ui.js`
- Modify: `assets/izakaya-app.css`
- Modify: `checkout/index.html`
- Modify: `admin/index.html`

- [x] Render category names by active language.
- [x] Render item descriptions with customer tags for set menus and payment notes.
- [x] Make checkout default to cash and show a store payment note.
- [x] Add a store information strip on customer-facing pages.

### Task 4: Verification

**Files:**
- No code-only file requirement.

- [x] Run `node tests/izakaya-core.test.js`.
- [x] Run `node tests/izakaya-i18n.test.js`.
- [x] Start or reuse `python3 -m http.server 8765`.
- [x] Browser-check order, kitchen, checkout, and admin pages.
- [x] Verify Japanese, Chinese, and English switching.
- [x] Capture screenshots for handoff.
