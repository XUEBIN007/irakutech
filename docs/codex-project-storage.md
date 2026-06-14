# Codex Project Storage

This document records where Codex development projects should live on this Mac.

## Recommended Root Folder

Use this folder as the main place for Codex development projects:

```text
~/projects
```

Current active project:

```text
~/projects/irakutech
```

When continuing work after a few weeks or months, start here:

```bash
cd ~/projects/irakutech
sed -n '1,220p' docs/development-workflow.md
sed -n '1,220p' docs/project-memo.md
git status --short --branch
git pull --ff-only origin main
```

## Project Naming

Recommended layout:

```text
~/projects/
  irakutech/                       company site and ordering demo
  demo-izakaya-ordering/           future standalone demo, if split later
  client-{customer}-izakaya/       future customer-specific ordering system
  demo-usedcars/                   future used-car demo
  demo-recycle/                    future recycle demo
  demo-realestate/                 future real-estate demo
```

## Current Local Findings

Confirmed active GitHub-synced repository:

```text
~/projects/irakutech
```

Other Git repositories were found under `~/Documents`. They should not be moved automatically. If a project becomes active again, decide case by case whether to migrate it into `~/projects`.

Old or duplicate-looking ordering-system paths found:

```text
~/irakuya/irakutech
~/Documents/点菜系统/irakutech
~/Documents/点菜系统
```

Do not delete or move these automatically. First compare contents and confirm which one is authoritative. For the current ordering-system work, use:

```text
~/projects/irakutech
```

## Codex App Data

Codex app data and caches are separate from project source code. Leave them where the app created them:

```text
~/.codex
~/Library/Application Support/com.openai.codex
~/Library/Caches/com.openai.codex
~/Library/Logs/com.openai.codex
~/.cache/codex-runtimes
```

These are application/runtime folders, not project folders. Do not move or edit them unless there is a specific reason and the user approves.

