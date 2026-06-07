# Win11 Codex Sync Notes

这份笔记用于在 Win11 电脑上接手 `irakutech` 项目时，复用 MacBook 已验证过的 GitHub 同步方式。

## 项目固定信息

- Repository: `https://github.com/XUEBIN007/irakutech.git`
- SSH remote: `git@github.com:XUEBIN007/irakutech.git`
- Main branch: `main`
- Project role: 公司官网 + 居酒屋点菜系统 demo + 可复制客户模板项目

## 开发前规则

1. 进入项目目录。
2. 检查 Git 状态和 GitHub 最新状态。
3. 本地不是最新时，先 `pull --ff-only`。
4. 只改项目文件夹。
5. 不改 Git 全局配置、系统网络、代理、凭据，除非明确批准。
6. 本地测试通过后再让用户验收。
7. 用户明确说可以提交或推送后，才 commit / push。
8. 两台电脑如果有冲突，先分析合并，不乱覆盖。

## Win11 推荐 Push 方案

长期稳定方案统一用 SSH，不依赖 GitHub HTTPS token，也不依赖 Windows Credential Manager。

在 Win11 Git Bash 或 PowerShell 中生成专用 SSH key:

```powershell
ssh-keygen -t ed25519 -C "XUEBIN007 irakutech Win11" -f "$env:USERPROFILE\.ssh\id_ed25519_github_xuebin007"
```

查看公钥:

```powershell
type "$env:USERPROFILE\.ssh\id_ed25519_github_xuebin007.pub"
```

把 `.pub` 文件内容添加到 GitHub:

- GitHub -> Settings -> SSH and GPG keys -> New SSH key
- Title: `irakutech-win11`
- Key type: `Authentication Key`
- Key: 粘贴 `.pub` 内容

## 项目内 SSH 配置

只在 `irakutech` 项目里设置，不改全局 Git:

```bash
git remote set-url origin git@github.com:XUEBIN007/irakutech.git
git config core.sshCommand "ssh -i ~/.ssh/id_ed25519_github_xuebin007 -o IdentitiesOnly=yes"
```

如果 Win11 Git Bash 不能识别 `~`，使用完整路径:

```bash
git config core.sshCommand "ssh -i C:/Users/你的用户名/.ssh/id_ed25519_github_xuebin007 -o IdentitiesOnly=yes"
```

验证 SSH:

```bash
ssh -i ~/.ssh/id_ed25519_github_xuebin007 -o IdentitiesOnly=yes -T git@github.com
```

成功时会看到:

```text
Hi XUEBIN007! You've successfully authenticated, but GitHub does not provide shell access.
```

## 每次开发前

```bash
git status --short --branch
git fetch origin
git rev-list --left-right --count main...origin/main
```

如果本地落后:

```bash
git pull --ff-only origin main
```

如果有冲突，不要覆盖，先分析。

## 每次开发后测试

至少运行:

```bash
node tests/izakaya-core.test.js
node tests/izakaya-i18n.test.js
node tests/site-public.test.js
node --check assets/izakaya-core.js
node --check assets/izakaya-ui.js
node --check assets/izakaya-i18n.js
```

## Commit / Push

用户明确批准后:

```bash
git add .
git commit -m "合适的提交说明"
git push origin main
```

确认 push 通畅:

```bash
git push --dry-run origin main
```

看到 `Everything up-to-date` 说明 SSH push 正常。

## MacBook 已完成状态

- SSH key title: `irakutech-macbook-20260606`
- Remote: `git@github.com:XUEBIN007/irakutech.git`
- Local project config: `core.sshCommand = ssh -i ~/.ssh/id_ed25519_github_xuebin007 -o IdentitiesOnly=yes`
- `git push origin main` 已验证成功。
- `git push --dry-run origin main` 已验证成功。

## 已知本地 Git 问题记录

MacBook 曾出现非法 ref:

```text
.git/refs/remotes/origin/main 2
```

症状:

```text
fatal: bad object refs/remotes/origin/main 2
```

处理方式:

```bash
mv '.git/refs/remotes/origin/main 2' .git/bad-ref-backup-origin-main-2
git fetch origin
```

原因判断: 这是本地 `.git` 下的异常重复 ref 文件，不是 GitHub 仓库问题。
