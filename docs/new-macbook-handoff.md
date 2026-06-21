# New MacBook Handoff

This document is for continuing Irakutech ordering-system development on a new MacBook.

## Current Authoritative Repository

Use this GitHub repository as the source of truth:

```text
git@github.com:XUEBIN007/irakutech.git
```

The authoritative local path on the old MacBook is:

```text
/Users/xuebin/projects/irakutech
```

Current confirmed branch and version on the old MacBook:

```text
branch: main
latest commit: 27b67f3 Merge branch 'codex/table-kitchen-progress-summary'
remote: git@github.com:XUEBIN007/irakutech.git
local main == origin/main
working tree: clean
```

Do not use these old or duplicate-looking paths for new development:

```text
/Users/xuebin/Documents/点菜系统
/Users/xuebin/Documents/点菜系统/irakutech
```

Those paths are not the current authoritative development repository.

## New MacBook Setup

Create the project root:

```bash
mkdir -p ~/projects
cd ~/projects
```

Clone with SSH:

```bash
git clone git@github.com:XUEBIN007/irakutech.git
cd ~/projects/irakutech
```

This project uses SSH for GitHub. Do not switch the remote to HTTPS.

If using the same dedicated GitHub key, set the repository-local SSH command:

```bash
git config core.sshCommand "ssh -i ~/.ssh/id_ed25519_github_xuebin007 -o IdentitiesOnly=yes"
```

Verify:

```bash
git remote -v
git config --local --get core.sshCommand
ssh -i ~/.ssh/id_ed25519_github_xuebin007 -T git@github.com
```

Expected SSH output includes:

```text
Hi XUEBIN007! You've successfully authenticated
```

If the SSH key is not on the new MacBook yet, add a GitHub SSH key first. Do not change GitHub repository settings or switch to HTTPS as a workaround.

## Verify The New MacBook Copy

After clone:

```bash
cd ~/projects/irakutech
git switch main
git pull --ff-only origin main
git status --short --branch
git log --oneline -5
```

Expected:

```text
## main...origin/main
27b67f3 Merge branch 'codex/table-kitchen-progress-summary'
```

After this handoff document is committed, the newest commit may be newer than `27b67f3`. In that case, the important check is:

```bash
git rev-parse HEAD origin/main main
```

All three hashes should match.

## Required Tools

Check:

```bash
git --version
node --version
python3 --version
```

The app itself is a static HTML/CSS/JavaScript project. No npm install is currently required.

If running inside Codex Desktop, Node may be available through Codex runtime. On the old MacBook the test node path was:

```text
/Users/xuebin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node
```

On the new MacBook, use whichever `node` is available:

```bash
node tests/izakaya-core.test.js
```

If `node` is not available, install/enable Node only after confirming with the user.

## Run Tests

From the repository root:

```bash
cd ~/projects/irakutech
for test in tests/*.js; do
  echo "RUN $test"
  node "$test" || exit 1
done
```

Tests currently include:

```text
tests/izakaya-cloud.test.js
tests/izakaya-core.test.js
tests/izakaya-i18n.test.js
tests/site-public.test.js
```

## Local Preview

Start:

```bash
cd ~/projects/irakutech
python3 -m http.server 8765
```

Open:

```text
http://127.0.0.1:8765/
http://127.0.0.1:8765/order/?table=3
http://127.0.0.1:8765/kitchen/
http://127.0.0.1:8765/checkout/
http://127.0.0.1:8765/admin/
```

The public GitHub Pages demo is:

```text
https://xuebin007.github.io/irakutech/
```

## Current System Status

The system is currently a static web demo with browser/local storage plus Supabase demo cloud sync config.

Main user-facing pages:

```text
/
/order/?table=3
/kitchen/
/checkout/
/admin/
/takeout/
```

Key source files:

```text
assets/izakaya-core.js      core data and ordering logic
assets/izakaya-ui.js        page rendering and UI event handlers
assets/izakaya-i18n.js      Japanese, Chinese, English text
assets/izakaya-cloud.js     Supabase demo sync adapter
assets/izakaya-config.js    demo Supabase config
assets/izakaya-app.css      shared styling
order/index.html            customer table ordering page
kitchen/index.html          kitchen display page
checkout/index.html         checkout/register page
admin/index.html            management page
tests/*.js                  regression tests
docs/*.md                   project workflow and handoff notes
```

Recent completed features include:

```text
- kitchen three-stage flow: 新订单 -> 制作中 -> 已完成
- line-level kitchen status, so moving one dish does not move all dishes in the same order
- customer order progress summary: 新订单 / 制作中 / 已完成
- course/all-you-can-eat eligible menu filtering
- staff call, checkout request, table dashboard, course timer alerts
```

## Development Flow On The New MacBook

Read first:

```bash
cd ~/projects/irakutech
sed -n '1,240p' docs/development-workflow.md
sed -n '1,220p' docs/project-memo.md
```

Before starting:

```bash
cd ~/projects/irakutech
git switch main
git pull --ff-only origin main
git status --short --branch
```

For new work:

```bash
git switch -c codex/<short-feature-name>
```

After edits:

```bash
for test in tests/*.js; do
  echo "RUN $test"
  node "$test" || exit 1
done

git status --short
git add .
git commit -m "说明"
git push -u origin codex/<short-feature-name>
```

Merge to main after the feature is complete:

```bash
git fetch origin
git switch main
git pull --ff-only origin main
git merge --no-ff codex/<short-feature-name>

for test in tests/*.js; do
  echo "RUN $test"
  node "$test" || exit 1
done

git push origin main
```

## Safety Rules

Do not modify these unless the user explicitly approves:

```text
macOS system settings
Git global config
SSH keys or GitHub account settings
GitHub repository settings
files outside ~/projects/irakutech
remote URL from SSH to HTTPS
```

If push fails, first check SSH authentication and repository-local config. Do not guess or change the remote.
