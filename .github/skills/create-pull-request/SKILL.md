---
name: create-pull-request
description: "Create a GitHub pull request for the current branch (only when not on main). Use to generate a PR title and description from recent commits."
argument-hint: "Provide optional PR title or description overrides."
user-invocable: false
---

# Create Pull Request (GitHub)

## When to Use
- You need a GitHub pull request for the current branch
- You want the PR title and description derived from recent commits
- You only want to proceed when the current branch is not `main`

## Inputs
- Optional: PR title override
- Optional: PR description override
- Required: GitHub org and repo name when creating the PR

## Procedure
1. Check the current Git branch.
2. If the branch is `main`, stop and ask the user to switch branches.
3. Collect recent commits on the current branch and summarize them into a PR title and description.
4. Ask the user to confirm or edit the generated title and description.
5. Create the PR using GitHub CLI (`gh pr create`), targeting `main` (default) unless the user specifies a different base branch.
6. Report the PR URL back to the user.

## Notes
- Use recent commits summary as the default description source.
- If the branch has no new commits, ask the user what to include in the PR description.

## Example (PowerShell)
```
gh pr create `
	--base main `
	--head <branch> `
	--title "<title>" `
	--body "<body>"
```
