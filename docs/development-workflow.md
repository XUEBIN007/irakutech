# Development Workflow

This document is the first file to read before continuing development on this project.

## Current Repository

- Local path: `~/projects/irakutech`
- GitHub remote: `git@github.com:XUEBIN007/irakutech.git`
- Default branch: `main`
- Branch naming for Codex work: `codex/<short-feature-name>`

This repository uses SSH for GitHub. Do not switch the remote to HTTPS.

Repository-local SSH command:

```bash
git config core.sshCommand "ssh -i ~/.ssh/id_ed25519_github_xuebin007 -o IdentitiesOnly=yes"
```

Check it before pushing if anything looks wrong:

```bash
git remote -v
git config --local --get core.sshCommand
ssh -i ~/.ssh/id_ed25519_github_xuebin007 -T git@github.com
```

Expected SSH authentication message includes:

```text
Hi XUEBIN007! You've successfully authenticated
```

## Before Starting Work

```bash
cd ~/projects/irakutech
git status --short --branch
git remote -v
git pull --ff-only origin main
```

If the working tree has files you did not change, do not overwrite or revert them. Check what they are first.

For feature work, create a Codex branch from the updated `main`:

```bash
git switch main
git pull --ff-only origin main
git switch -c codex/<short-feature-name>
```

## Local Preview

Start the preview server from the repository root:

```bash
cd ~/projects/irakutech
python3 -m http.server 8765
```

Open these URLs:

```text
http://127.0.0.1:8765/
http://127.0.0.1:8765/order/?table=3
http://127.0.0.1:8765/kitchen/
http://127.0.0.1:8765/checkout/
http://127.0.0.1:8765/admin/
```

## Test Commands

Use the Codex bundled Node on this Mac:

```bash
/Users/xuebin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/izakaya-core.test.js
/Users/xuebin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/izakaya-i18n.test.js
```

Run all tests before every commit:

```bash
for test in tests/*.js; do
  echo "RUN $test"
  /Users/xuebin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node "$test" || exit 1
done
```

## Commit And Push A Feature Branch

After tests pass:

```bash
git status --short
git add .
git commit -m "feat: short description"
git push -u origin codex/<short-feature-name>
```

## Merge Feature Work To Main

The project rule is: after a feature is finished and pushed, merge it to `main` too.

Preferred local merge flow:

```bash
git fetch origin
git switch main
git pull --ff-only origin main
git merge --no-ff codex/<short-feature-name>
```

Run all tests again. If they pass:

```bash
git push origin main
```

If the feature branch has already been merged and `main` just needs to be pushed:

```bash
git switch main
git status --short --branch
git push origin main
```

## Daily Development Memory

Start:

```bash
cd ~/projects/irakutech
git pull --ff-only origin main
```

Finish:

```bash
git status
git add .
git commit -m "说明"
git push
```

For this project, also confirm the work is on `main` after the feature branch is complete.

## Do Not Change

Do not change these unless the user explicitly approves:

- macOS system settings
- Git global config
- SSH keys or GitHub account settings
- GitHub repository settings
- files outside this repository
- the remote URL from SSH to HTTPS

