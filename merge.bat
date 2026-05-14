@echo off
REM Merge script - Merge topic branch to main

setlocal enabledelayedexpansion

set TOPIC_WORKTREE=D:\Projects\Loom.worktrees\agents-project-pre-deployment-review
set MAIN_WORKTREE=D:\Projects\Loom
set BASE_BRANCH=main
set TOPIC_BRANCH=agents-project-pre-deployment-review

echo.
echo ========================================
echo MERGE WORKFLOW
echo ========================================
echo Topic Worktree: %TOPIC_WORKTREE%
echo Main Worktree: %MAIN_WORKTREE%
echo Base Branch: %BASE_BRANCH%
echo Topic Branch: %TOPIC_BRANCH%
echo.

REM Step 1: Check for uncommitted changes in topic worktree
echo Step 1: Checking for uncommitted changes in topic worktree...
cd /d "%TOPIC_WORKTREE%"
git status --porcelain > temp_status.txt
set /p STATUS=<temp_status.txt
if not "!STATUS!"=="" (
    echo.
    echo ⚠️ Found uncommitted changes in topic worktree:
    type temp_status.txt
    echo.
    echo You need to commit changes first. Use git commit or /commit skill.
    pause
    goto :end
)
del temp_status.txt
echo ✅ Topic worktree is clean.
echo.

REM Step 2: Merge topic branch into main
echo Step 2: Merging %TOPIC_BRANCH% into %BASE_BRANCH%...
cd /d "%MAIN_WORKTREE%"

git merge %TOPIC_BRANCH%

if errorlevel 1 (
    echo.
    echo ⚠️ Merge conflict detected!
    echo.
    echo Conflicted files:
    git diff --name-only --diff-filter=U
    echo.
    echo To resolve: Edit the conflicted files, then run:
    echo   git add ^<file^>
    echo   git commit --no-edit
    echo.
    pause
    goto :end
)

echo.
echo ✅ Merge completed successfully!
echo.

REM Step 3: Verify merge
echo Step 3: Verifying merge...
echo.
echo New commit:
git log --oneline -1
echo.

git merge-base --is-ancestor %TOPIC_BRANCH% HEAD
if errorlevel 1 (
    echo ⚠️ Warning: Topic branch is not an ancestor of HEAD
) else (
    echo ✅ Topic branch is merged into main
)

echo.
echo ========================================
echo Merge complete! Main worktree status:
echo ========================================
echo.
git status
echo.

pause

:end
endlocal
