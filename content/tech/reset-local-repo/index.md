+++
date = '2025-10-02T13:30:12+06:30'
draft = false
title = 'Reset Local Repo to Match Remote Repo Exactly'
description = 'Resetting local project repo to match the remote repo exactly.'
categories = ['tech', 'dev']
tag = ['git', 'dev']
[params.add]
    codeblock = true
+++

At any point, you will want to completely reset your local project so it matches the remote repo exactly (discarding any local changes, extra files, etc.).

Here are the safe ways depending on how “hard” a reset you need:

### Option 1: Reset branch to remote (keeps untracked files) {class="mt3rem"}

```text {text="bash"}
git fetch --all
git reset --hard origin/main
```

- Discards local commits
- Resets all tracked files to the remote state
- Leaves untracked files (stuff Git doesn’t know about) in your working directory

### Option 2: Reset branch and also delete untracked files {class="mt3rem"}

```text {text="bash"}
git fetch --all
git reset --hard origin/main
git clean -fd
```

- **-f** means force
- **-d** means removing untracked directories too
- After this, your working directory (local project repo) matches to the remote repo exactly.

### Option 3: Really start fresh (nuke & re-clone) {class="mt3rem"}

```text {text="bash"}
cd ..
rm -rf your-project-folder
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

- Above is simplest and cleanest
- This guarantees no leftover files or configs
- Useful if you’ve had a lot of messy local changes

### origin/main vs origin main {class="mt3rem"}

`origin/main` is a **ref name** (a branch), single argument.

- **origin** is your remote name.
- **main** is the branch on that remote.
- Together, **origin/main** means “the main branch as last fetched from origin.”

Example:

```text {text="bash"}
git reset --hard origin/main
```

→ Resets your current branch to exactly match the remote tracking branch.

But `git` interprets `origin main` as **two separate arguments**.

Example:

```text {text="bash"}
git push -u origin main
```

**Note**: the option **-u** is to update pushing history for later use. So, no need `origin main` later and only `git push` will do `git push origin main`.

Git interprets the arguments like this:

- **origin** → the name of the remote (a shortcut for the remote URL).
- **main** → the local branch you want to push.
- Because you didn’t specify a remote branch, Git assumes you want to push **main** → **main** (same branch name on the remote).

The complete command syntax is:

```text {text="bash"}
git push <remote> <local-branch>:<remote-branch>
```

So, to push local **main** branch to remote **production** branch is:

```text {text="bash"}
git push origin main:production
```

### git reset origin main {class="mt3rem"}

The `git reset` command expects only one revision (like `HEAD`, `abc123`, `origin/main`). If you give it two, Git complains:

```text {text="bash"}
git reset --hard origin main
# error: unknown switch `m'
# fatal: ambiguous argument 'origin': unknown revision or path not in the working tree.
```
