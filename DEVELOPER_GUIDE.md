# 🚀 Quick Start - Post-Fixes Developer Guide

## What Changed?

All critical issues have been fixed. Here's what you need to know:

### 🔴 Critical Changes (Breaking)

1. **Guest credentials moved to backend**
   - No longer in source code
   - Use `/api/guest-credentials` endpoint
   - Environment variables: `GUEST_EMAIL`, `GUEST_PASSWORD`

2. **Firebase Storage for images**
   - Images now in Firebase Storage, not Firestore
   - URLs stored in Firestore (in `imageUrl` field)
   - `storagePath` field tracks actual Storage path

3. **Firebase auth must pass app instance**
   - Changed: `getAuth()` → `getAuth(app)`
   - Required for Vercel deployments

### 🟠 Important Improvements

4. **Input sanitization for AI**
   - Use `sanitizeSceneInput()` for Gemini API
   - Use `sanitizeSearchInput()` for search filters
   - Prevents prompt injection attacks

5. **New utility files created**
   - `src/lib/inputValidation.ts` - Sanitization
   - `src/lib/structuredLogging.ts` - Error logging
   - `src/lib/categoryKeywords.ts` - Category classification
   - `src/lib/colorContrast.ts` - WCAG contrast checking

---

## How to Deploy

### Step 1: Verify Everything Works
```bash
npm run check      # TypeScript + ESLint
npm run build      # Production build (should succeed)
npm run dev        # Test locally
```

### Step 2: Configure Environment

**Backend `.env`**:
```
GEMINI_API_KEY=your_key
GUEST_EMAIL=guest@loom.local
GUEST_PASSWORD=change_this_in_production
PORT=5000
```

**Frontend `.env.local`**:
```
VITE_API_URL=https://api.loom.app
VITE_FIREBASE_API_KEY=...
[other Firebase config]
```

### Step 3: Deploy Firebase Rules

```bash
firebase deploy --only firestore:rules
```

**For Storage rules**:
1. Go to Firebase Console → Storage → Rules
2. Copy content from `firebase-storage.rules`
3. Paste and publish

### Step 4: Deploy to Staging
```bash
git add .
git commit -m "fix: All pre-deployment review issues resolved"
git push origin main
```

### Step 5: Manual Testing
See `DEPLOYMENT_CHECKLIST.md` for full testing guide

---

## File Reference Guide

### 🔒 Security & Validation
```typescript
// Sanitize user input before sending to Gemini API
import { sanitizeSceneInput, sanitizeSearchInput } from '@/lib/inputValidation';

const cleanScene = sanitizeSceneInput(userInput); // max 200 chars, no special chars
const cleanSearch = sanitizeSearchInput(searchTerm); // prevents regex injection
```

### 📋 Logging & Errors
```typescript
// Production error logging
import { logStructuredError, getUserFriendlyMessage } from '@/lib/structuredLogging';

try {
  await deleteItem(id);
} catch (error) {
  logStructuredError(error, 'error', 'delete_item_failed', { itemId: id });
  // Shows user-friendly message instead of technical error
}
```

### 🎯 Category Classification
```typescript
// Classify items by type
import { classifyItemType, CATEGORY_KEYWORDS } from '@/lib/categoryKeywords';

const category = classifyItemType("blue cotton shirt"); // Returns "topWear"
const isPreset = isPresetCategory("topWear"); // Returns true
```

### ♿ Color Contrast
```typescript
// Check WCAG compliance
import { meetsWCAG_AA } from '@/lib/colorContrast';

const passes = meetsWCAG_AA('#f5f2ed', '#4b5563'); // true (gray600 on background)
```

### 🔥 Firebase Setup
```typescript
// Correct auth initialization
import { getAuth } from 'firebase/auth';
import { app } from './firebase';

const auth = getAuth(app); // MUST pass app instance
```

### 📸 Image Upload to Storage
```typescript
// Upload image to Firebase Storage with progress
import { ref, uploadBytes, getDownloadURL, UploadTaskSnapshot } from 'firebase/storage';
import { storage } from '@/lib/firebase';

const storageRef = ref(storage, `closet-items/${userId}/${itemId}.webp`);
const uploadTask = uploadBytes(storageRef, webpBlob);

// Progress updates:
uploadTask.on('state_changed', (snapshot: UploadTaskSnapshot) => {
  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  console.log(`Upload progress: ${progress}%`);
});

const downloadURL = await getDownloadURL(storageRef);
```

---

## Troubleshooting

### Build Fails

**Error**: "getAuth requires app instance"
```
Solution: Already fixed in src/lib/firebase.ts (line 21)
Check: Ensure you're using getAuth(app), not getAuth()
```

**Error**: TypeScript compilation fails
```
Solution: Run npm run check to see what's wrong
Common: Import path typos, missing types
Fix: Check FIXES_SUMMARY.md for type changes
```

### Guest Login Doesn't Work

**Error**: 401 Unauthorized or credentials undefined
```
Solution: Check /api/guest-credentials endpoint
Verify: GUEST_EMAIL and GUEST_PASSWORD set in backend .env
Test: curl http://localhost:5000/api/guest-credentials
```

### Images Not Uploading

**Error**: Upload fails silently or returns 403
```
Solution: Check Firebase Storage security rules deployed
Verify: Rules allow uploads to closet-items/{userId}/{itemId}
Firebase: Go to Console → Storage → Rules to check
```

**Error**: Image in Firestore but not in Storage
```
Solution: Check storagePath field in document
Verify: Path matches pattern in Firestore rules
Regex: ^(closet-items/[a-zA-Z0-9_-]+/[a-zA-Z0-9_-]+\.webp)?$
```

### AI Suggestions Failing

**Error**: Gemini API returns error
```
Solution: Check GEMINI_API_KEY set correctly
Verify: API key has Gemini API enabled
Test: Use structured logging to see exact error
```

**Error**: "Prompt was blocked"
```
Solution: Input sanitization may be too strict
Check: sanitizeSceneInput and sanitizeSearchInput functions
Note: These remove special chars but allow basic punctuation
```

---

## Testing Checklist

### Before Pushing to Staging
- [ ] `npm run check` passes with no errors
- [ ] `npm run build` succeeds
- [ ] Can login with email/password
- [ ] Can login with Google
- [ ] Can login as guest
- [ ] Can upload image (see progress bar)
- [ ] Image appears in closet
- [ ] Can generate outfit suggestions
- [ ] Can save/delete looks from lookbook
- [ ] Favorite and laundry toggles work
- [ ] Search filters by category/vibe/season
- [ ] Mobile responsive (iPhone 12, iPad)
- [ ] Dark/light mode toggle works
- [ ] No console errors

### After Staging Deployment
- [ ] Same flows work on staging server
- [ ] API calls go to correct backend
- [ ] Images upload to correct Storage bucket
- [ ] Performance acceptable (< 3s load time)
- [ ] Error messages show correctly
- [ ] Analytics tracking works (if enabled)

---

## Important Files

### Configuration
- `.env.example` - Environment variable template
- `firebase.json` - Firebase project config
- `.eslintrc.json` - ESLint rules
- `vite.config.ts` - Vite build config

### New Utilities
- `src/lib/inputValidation.ts` - Sanitization functions
- `src/lib/structuredLogging.ts` - Error logging
- `src/lib/categoryKeywords.ts` - Category constants
- `src/lib/colorContrast.ts` - Color accessibility

### Documentation
- `DEPLOYMENT_CHECKLIST.md` - Full pre-deployment guide
- `FIXES_SUMMARY.md` - What was fixed and why
- `FINAL_STATUS.md` - Overall status report
- `README.md` - Updated with deployment instructions

### Deployment
- `firebase-storage.rules` - Storage security rules
- `firestore.rules` - Firestore security rules
- `vercel.json` - Vercel deployment config
- `server/index.cjs` - Backend with new endpoints

---

## Performance Tips

### Image Optimization
- Always compress to WebP at 0.7 quality before upload
- Max size: 2MB per image (enforced by Storage rules)
- Current app uploads ~100-300KB per image (good)

### Database Queries
- Firestore: 1 read per item when fetching closet
- Use local React state for UI changes
- Batch operations in transactions for consistency

### API Calls
- Use try/catch with structured logging
- Consider retry logic for network failures
- Monitor quota in Google Cloud Console

### Monitoring
- Check Firebase Console for quota usage
- Review error logs in structured logging
- Monitor response times for AI suggestions (target: < 2s)

---

## Development Workflow

### Local Setup
```bash
git clone <repo>
cd loom
npm install
cp .env.example .env
# Edit .env with your Firebase config and GEMINI_API_KEY
npm run dev
```

### Making Changes
1. Create feature branch: `git checkout -b feature/description`
2. Make changes to code
3. Run `npm run check` to verify
4. Test locally: `npm run dev`
5. Commit: `git commit -m "message"`
6. Push: `git push origin feature/description`
7. Create Pull Request

### Code Review Checklist
- [ ] No hardcoded secrets
- [ ] Input validated/sanitized if user-provided
- [ ] Error handling consistent with structuredLogging
- [ ] TypeScript types correct (no `any`)
- [ ] No console.log in production code
- [ ] Accessibility: ARIA labels if needed
- [ ] Mobile responsive
- [ ] Performance acceptable

---

## Contact & Support

For questions about:
- **Deployment**: See DEPLOYMENT_CHECKLIST.md
- **Code changes**: See FIXES_SUMMARY.md
- **Firebase setup**: See firebase.json and security rules
- **Environment config**: See .env.example
- **Troubleshooting**: See this guide's Troubleshooting section

---

**Status**: Ready for staging  
**Last Updated**: Post-fixes  
**Next Steps**: Deploy to staging, manual testing, create test suite
