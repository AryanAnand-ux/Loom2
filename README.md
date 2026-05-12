# Loom — Smart Wardrobe Assistant

> Digitize your closet, track what you wear, and let AI style your outfits.

Loom is a full-stack web app that helps you manage your wardrobe digitally. Take a photo of any clothing item, and Loom's AI will automatically classify it by type, color, formality, and season. When you need outfit help, the built-in Stylist AI picks a cohesive look from your closet based on the weather and occasion.

Built as a student project to explore AI integration, real-time databases, and responsive design.

---

## Features

- **AI Classification** — Snap a photo and Gemini AI identifies the category, colors, vibe, season, and formality score automatically.
- **Stylist AI** — Generates complete outfit suggestions (top + bottom + footwear) using color theory, weather, and occasion context.
- **Digital Closet** — Browse, search, and filter your wardrobe. Mark items as favorites or flag them for laundry.
- **Lookbook** — Save your favorite AI-generated outfits for later reference.
- **Wardrobe Analytics** — Visual breakdown of your closet composition with interactive charts.
- **Camera Capture** — Take photos directly from your device camera or upload from gallery.
- **Guest Mode** — Try the app instantly with pre-loaded sample items, no account needed.
- **Fully Responsive** — Works on phones, tablets, and desktops with a mobile-first design.

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion |
| Backend | Node.js, Express |
| AI | Google Gemini 2.5 Flash (via GenAI SDK) |
| Database | Firebase Firestore (real-time sync) |
| Auth | Firebase Authentication (Email/Password, Google Sign-In) |
| Charts | Recharts |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Project Structure

```
Loom/
├── src/
│   ├── components/      # React UI components
│   ├── hooks/           # Custom React hooks (useCloset, useOutfits)
│   ├── services/        # API clients & guest seeding logic
│   ├── lib/             # Firebase config, error utils, helpers
│   └── types/           # Shared TypeScript interfaces
├── server/
│   └── index.cjs        # Express backend (Gemini API proxy)
├── firestore.rules      # Firestore security rules
├── index.html           # Entry point
└── vite.config.ts       # Build configuration
```

---

## Screenshots

![Login Page](assests/login.png)

&nbsp;

![Dashboard](assests/dashboard.png)

&nbsp;

![My Closet](assests/my-closet.png)

---

## How It Works

1. **Sign up** with email or Google, or try **Guest Mode** instantly.
2. **Add clothes** by taking a photo or uploading from gallery — AI classifies everything.
3. **Browse your closet** with filters for category, season, favorites, and laundry status.
4. **Ask the Stylist AI** to dress you for any occasion and weather.
5. **Save outfits** to your Lookbook for quick reference.

---

## Future Improvements

- Outfit history & wear tracking
- Clothing donation suggestions for unused items
- Weather API integration for automatic weather detection
- Social sharing of Lookbook outfits
- PWA support for native app-like experience

---

## Author

Built by **Aryan** 


