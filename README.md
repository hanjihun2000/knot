# Knot Development Information

## Docker

`docker-compose up -d` to initiate both client and server environment

`docker-compose up -d --build` to rebuild both client and server environment

`docker-compose down` to close both client and server environment

`docker-compose restart` to restart both client and server environment

## GitHub

Here are instructions for staging, committing, branching, merging, pushing, and pulling using both Visual Studio Code (VSCode) and the command line:

### Staging Files

**VSCode:**

1. Open your project in VSCode.
2. Go to the Source Control view (Ctrl+Shift+G on Windows/Linux, Cmd+Shift+G on Mac).
3. You'll see a list of modified files under the "Changes" section.
4. Hover over a file and click the "+" icon to stage it, or use the "Stage All Changes" button to stage all modified files.

**Command Line:**

1. Navigate to your project directory.
2. Use `git add <file>` to stage a specific file, or `git add .` to stage all modified files.

### Committing Changes

**VSCode:**

1. After staging your files, enter a commit message in the "Message" text box at the top of the Source Control view.
2. Click the checkmark icon or press Ctrl+Enter (Windows/Linux) or Cmd+Enter (Mac) to commit your changes.

**Command Line:**

1. Use `git commit -m "Your commit message"` to commit your staged changes.

### Branching

**VSCode:**

1. Go to the Source Control view (Ctrl+Shift+G on Windows/Linux, Cmd+Shift+G on Mac).
2. Click on the branch name in the bottom-left corner of the view.
3. Select "Create new branch" and enter a name for your new branch.

**Command Line:**

1. Use `git branch <branch-name>` to create a new branch.
2. Use `git checkout <branch-name>` to switch to that branch.

### Merging

**VSCode:**

1. Switch to the branch you want to merge into (e.g., `main` or `master`).
2. Go to the Source Control view (Ctrl+Shift+G on Windows/Linux, Cmd+Shift+G on Mac).
3. Click on the branch name in the bottom-left corner of the view.
4. Select "Merge from..." and choose the branch you want to merge.

**Command Line:**

1. Switch to the branch you want to merge into with `git checkout <branch-to-merge-into>`.
2. Use `git merge <branch-to-merge>` to merge the specified branch into your current branch.

### Pushing to a Remote

**VSCode:**

1. After committing your changes, you'll see a "Publish to..." section in the Source Control view.
2. Click on the "Publish to..." button and select your remote (e.g., `origin`) and the branch you want to push to.

**Command Line:**

1. Use `git push <remote-name> <branch-name>` to push your local branch to a remote repository.
2. For example, `git push origin main` to push your local `main` branch to the `origin` remote.

### Pulling from a Remote

**VSCode:**

1. Switch to the branch you want to pull changes into.
2. Go to the Source Control view (Ctrl+Shift+G on Windows/Linux, Cmd+Shift+G on Mac).
3. Click on the "..." menu and select "Pull from..." or "Pull, Push" to fetch and merge changes from a remote.

**Command Line:**

1. Use `git pull <remote-name> <branch-name>` to pull changes from a remote repository into your local branch.
2. For example, `git pull origin main` to pull the latest changes from the `origin` remote's `main` branch into your local `main` branch.

These instructions cover the basic Git operations for staging, committing, branching, merging, pushing, and pulling using both VSCode's integrated Git tools and the command line interface. Feel free to include these in your project's README for others to reference.
