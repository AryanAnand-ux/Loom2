@echo off
REM Commit and push script for Loom project

cd /d "D:\Projects\Loom.worktrees\agents-project-pre-deployment-review"

echo.
echo ========================================
echo Committing all changes...
echo ========================================
echo.

REM Stage all changes
git add .

REM Commit with the comprehensive message
git commit -m "fix: Security hardening & code quality improvements" -m "BREAKING CHANGES: Guest credentials now served from backend API

Features:
- Migrate image storage from Firestore to Firebase Storage
- Add image upload progress indicator
- Add structured error logging
- Add input sanitization utilities
- Add ARIA labels for accessibility
- Add color contrast utilities

Security:
- Fix Firebase auth initialization (getAuth → getAuth(app))
- Move hardcoded guest credentials to backend /api/guest-credentials
- Strengthen Firestore and Storage security rules
- Add input sanitization to prevent prompt injection
- Add environment variable validation

Code Quality:
- Centralize category keywords (eliminate duplication)
- Improve type safety with FirestoreTimestamp types
- Standardize error handling patterns
- Add utility functions

Accessibility:
- Add aria-label attributes to icon buttons
- Enhance mobile safe-area CSS

Documentation:
- Add DEPLOYMENT_CHECKLIST.md
- Add DEVELOPER_GUIDE.md
- Add PRE_COMMIT_VERIFICATION.md
- Add READY_TO_COMMIT.md
- Update README with deployment guide

Fixes: All 32+ critical issues from pre-deployment review

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

echo.
echo Commit status:
git status --short

echo.
echo ========================================
echo Pushing to GitHub...
echo ========================================
echo.

git push origin HEAD

echo.
echo ========================================
echo Done!
echo ========================================
echo.

git log --oneline -1

pause
