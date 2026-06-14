# Irakutech Project Memo

Read this first for the current development flow:

```text
docs/development-workflow.md
```

Read this for local project storage rules:

```text
docs/codex-project-storage.md
```

## GitHub Push

This repository should use SSH, not HTTPS.

Remote:

```bash
git@github.com:XUEBIN007/irakutech.git
```

Required local SSH key:

```bash
~/.ssh/id_ed25519_github_xuebin007
```

Repository-local SSH command:

```bash
git config core.sshCommand "ssh -i ~/.ssh/id_ed25519_github_xuebin007 -o IdentitiesOnly=yes"
```

Push command:

```bash
git push origin main
```

Standard completion flow after a feature branch has been pushed:

```bash
git fetch origin
git switch -c codex/merge-<feature>-into-main origin/main
git merge --no-ff <feature-branch>
# resolve conflicts, run tests
git push origin HEAD:main
```

Do not switch the remote back to HTTPS. Keep using the SSH remote and repository-local `core.sshCommand`.

If push fails with `Permission denied (publickey)`, verify:

```bash
ssh -i ~/.ssh/id_ed25519_github_xuebin007 -T git@github.com
git remote -v
git config --get core.sshCommand
```

Expected SSH test output includes:

```text
Hi XUEBIN007! You've successfully authenticated
```

## Local Development

Start preview:

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

## Tests

Node is bundled with Codex on this Mac. Current working path:

```bash
/Users/xuebin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node
```

Run all tests:

```bash
for test in tests/*.js; do
  echo "RUN $test"
  /Users/xuebin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node "$test" || exit 1
done
```

Older Codex app path, if needed:

```bash
/Applications/Codex.app/Contents/Resources/cua_node/bin/node tests/izakaya-core.test.js
/Applications/Codex.app/Contents/Resources/cua_node/bin/node tests/izakaya-i18n.test.js
```

If that path is not available in the desktop runtime, use the path returned by Codex workspace dependencies.
