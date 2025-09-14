+++
date = '2025-08-13T12:56:29+06:30'
draft = false
title = 'Git Rebase'
description = 'Using git pull --rebase or git config pull.rebase true for git rebase.'
categories = ['tech', 'dev']
tags = ['git', 'rebase']
[params.add]
    codeblock = true
+++

{{< image-local src="git-rebase-3.jpg" alt="git rebase" >}}

&nbsp;
{class="space-one"}

In the following scenario, the safest option is using `git pull --rebase` or setting configuration by `git config pull.rebase true`.

### Analysis of the scenario

1. Current state on Remote:  
file *aaa.txt* exits and file *bbb.txt* does not exist yet.
2. Current state on Local:  
file *aaa.txt* does not exist and file *bbb.txt* has been created.

In above scenario and local repository on the computer, git push will fail with the following message:

```text
To https://codeberg.org/minsoehan/ttmy.git
! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'https://codeberg.org/minsoehan/ttmy.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref. If you want to integrate the remote changes, use
hint: 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

According to the message, if `git pull` is run, it will pull changes from remote to local but it will also produce the following message because of divergent branches that need to specify how to reconcile them.

```text
remote: Enumerating objects: 4, done.
remote: Counting objects: 100% (4/4), done.
remote: Compressing objects: 100% (3/3), done.
remote: Total 3 (delta 1), reused 0 (delta 0), pack-reused 0 (from 0)
Unpacking objects: 100% (3/3), 248 bytes | 248.00 KiB/s, done.
From https://codeberg.org/minsoehan/ttmy
    7caa736..0aebcd6  main       -> origin/main
hint: You have divergent branches and need to specify how to reconcile them.
hint: You can do so by running one of the following commands sometime before
hint: your next pull:
hint:
hint:   git config pull.rebase false  # merge
hint:   git config pull.rebase true   # rebase
hint:   git config pull.ff only       # fast-forward only
hint:
hint: You can replace "git config" with "git config --global" to set a default
hint: preference for all repositories. You can also pass --rebase, --no-rebase,
hint: or --ff-only on the command line to override the configured default per
hint: invocation.
fatal: Need to specify how to reconcile divergent branches.
```

At this stage, doing `git config pull.rebase true` or `git pull --rebase` is the best option.

Rebase applies the remote changes *aaa.txt* on top of your local branch, then reapplies your local changes *bbb.txt* on top of the updated branch.

This avoids creating an unnecessary merge commit, keeps the history clean, and ensures that *aaa.txt* and *bbb.txt* coexist. After the rebase, you can safely push *bbb.txt* file.