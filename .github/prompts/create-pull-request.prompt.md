---
description: "Create a PR for the current branch if none exists"
name: "create pull request"
argument-hint: "Optional: base=<branch>, title=<text>, body=<text>"
agent: "agent"
---
Check whether an open PR already exists for the current branch on GitHub.
- If a PR exists, respond with: "PR already exists" and include the PR link. Stop.
- If no PR exists, create one targeting `main` unless `base=` is provided.
- If `title=` or `body=` are not provided, generate them from recent commits.
- If the current branch is `main` or detached, ask the user how to proceed.
Use the repository's `create-pull-request` skill to generate the PR title/body and create the PR.