# Loom: Developer Project Breakdown

Hey! Here is a developer-centric breakdown of what we built. If you need to explain this project in an interview or to another developer, this document covers the architecture, the "why," and the "how."

---

## 1. High-Level Architecture
Loom is a **Full-Stack Application** utilizing a hybrid architecture:
- **Client-Side (BaaS):** We use Firebase as a Backend-as-a-Service (BaaS) for direct client-to-database communication (Authentication & Firestore). This removes the need for us to write our own CRUD APIs.
- **Server-Side (Proxy API):** We use a lightweight Node.js/Express server exclusively as a secure proxy to talk to the Google Gemini AI. We *have* to do this because exposing an AI API key directly in the frontend React code is a massive security risk.

---

## 2. The Tech Stack

### Frontend (The Face of the App)
*   **React 19:** The core UI library. We use functional components and hooks (`useState`, `useEffect`, `useMemo`) for state management.
*   **Vite:** Our build tool and dev server. It is significantly faster than standard Create React App (CRA) due to esbuild and native ES modules.
*   **Tailwind CSS (v4):** A utility-first CSS framework. It allows us to style components directly in the JSX without writing external CSS files, ensuring our design remains highly responsive.
*   **Framer Motion:** Used for smooth animations, page transitions, and micro-interactions (like the hover states on the outfit cards).
*   **Recharts:** A composable charting library built on React components, used for the Wardrobe Analytics dashboard to render SVGs dynamically.
*   **React Router (v7):** Handles Client-Side Routing (CSR). It allows users to navigate between the Dashboard, Closet, and Stylist pages without reloading the browser.

### Backend (The AI Proxy)
*   **Node.js & Express:** A minimal server that listens for HTTP POST requests from the frontend.
*   **`@google/genai` SDK:** The official Google SDK used to prompt Gemini.
*   **CORS:** Middleware that ensures only our specific frontend domains (Vercel & localhost) are allowed to make requests to this backend, preventing abuse.

### Database & Auth (Firebase)
*   **Firebase Authentication:** Handles user sign-ups, logins, and session management (Email/Password & Google OAuth). We also built a custom "Guest Mode" that generates an anonymous-like session seeded with sample data.
*   **Cloud Firestore:** A NoSQL, real-time document database. 
    *   *Data Structure:* We use a sub-collection structure (`users/{userId}/closet/{itemId}`) to heavily partition data.
    *   *Real-time Sync:* The frontend uses `onSnapshot` listeners. When a user deletes an item, the UI updates instantly without needing a page refresh.
    *   *Security Rules:* We wrote strict Firestore Security Rules to ensure users can only read/write documents where `ownerId == request.auth.uid`.

---

## 3. How the Core Features Actually Work

### A. AI Image Classification (The "Add Item" flow)
1.  **Client:** The user takes a photo or uploads an image. The frontend converts the image file into a lightweight `Base64` string.
2.  **Network:** The React app sends an HTTP POST request containing the Base64 string to our Express backend (`/api/classify`).
3.  **Backend:** Express receives the image, wraps it in a prompt asking for JSON output, and sends it to **Gemini 2.5 Flash**.
4.  **Database:** The backend returns the parsed JSON (category, color, vibe) to React. React takes that data, adds the user's ID and the Base64 image, and saves it directly to Firestore.

### B. The Stylist AI
1.  **Client:** When the user clicks "Dress Me", React gathers the user's *entire* closet array from local state and the currently selected weather/occasion.
2.  **Network:** React sends this array and context to the Express backend (`/api/suggest`).
3.  **Backend:** The Express server tells Gemini: *"Here is a JSON array of clothes. Act as a stylist. Pick one top, one bottom, and one footwear for [Occasion/Weather]. Return the IDs of the chosen items."*
4.  **Client:** React receives the IDs, filters the local closet state to find those specific images, and renders the outfit on screen.

### C. Data Persistence & Scalability
Originally, we planned to use Firebase Storage for images. However, to bypass billing requirements and quotas on the free tier, we optimized the app to store highly compressed `Base64` image strings directly inside the Firestore NoSQL documents. Because Firestore has a 1MB limit per document, we compress images on the frontend before saving them.

---

## 4. Deployment Pipeline
*   **Frontend (Vercel):** Connected directly to GitHub. Every time we push to the `main` branch, Vercel pulls the code, runs `npm run build`, and hosts the static `dist/` folder on a global CDN.
*   **Backend (Render):** Connected to GitHub as a Web Service. It pulls the code, runs `npm install`, and starts the Node server (`node server/index.cjs`). Render provides a public URL which we plug into Vercel's environment variables (`VITE_API_URL`).
