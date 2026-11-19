<div align="center">

# 📚 BookNook — Modern Online Community Library

**Add a book. Borrow a book. Return a book.**

A full-stack, editorial-styled online community library built with **Next.js (App Router)**, **Express.js**, **MongoDB**, **BetterAuth**, and **JWT Authorization**. Designed for curious readers to contribute titles, discover curated books, track live copy availability, and manage borrowing effortlessly.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_BookNook-0f4c3a?style=for-the-badge&logo=vercel&logoColor=white)](https://YOUR_LIVE_URL.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend_API-Live_Server-b45309?style=for-the-badge&logo=express&logoColor=white)](https://YOUR_SERVER_URL.vercel.app)
[![Server Repo](https://img.shields.io/badge/Server_Code-GitHub-1c1917?style=for-the-badge&logo=github&logoColor=white)](https://github.com/YOUR_GITHUB_USERNAME/booknook-server)

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-20232a?style=flat-square&logo=react&logoColor=61dafb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)
![DaisyUI](https://img.shields.io/badge/DaisyUI-v5-5a0ef8?style=flat-square&logo=daisyui&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-REST_API-404d59?style=flat-square&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47a248?style=flat-square&logo=mongodb&logoColor=white)
![BetterAuth](https://img.shields.io/badge/Auth-BetterAuth_+_JWT-10b981?style=flat-square)

</div>

---

## 🌐 Live Links

- **Live Website:** [https://YOUR_LIVE_URL.vercel.app](https://YOUR_LIVE_URL.vercel.app)
- **Backend API Base URL:** [https://YOUR_SERVER_URL.vercel.app](https://YOUR_SERVER_URL.vercel.app)
- **Client Repository:** [https://github.com/YOUR_GITHUB_USERNAME/booknook-client](https://github.com/YOUR_GITHUB_USERNAME/booknook-client)
- **Server Repository:** [https://github.com/YOUR_GITHUB_USERNAME/booknook-server](https://github.com/YOUR_GITHUB_USERNAME/booknook-server)

---

## 📖 Project Overview

**BookNook** transforms the simple idea of community book sharing into a polished, production-ready web application. Unlike static library demos, BookNook handles **real-time inventory concurrency**, **role/ownership protection**, **session persistence across reloads**, and **cloud image hosting** — all wrapped inside a responsive light/dark editorial interface.

Whether a reader wants to contribute a book from their personal shelf, search across genres, borrow a copy with a scheduled return date, or return a finished read, every interaction updates the database atomically with clear toast feedback and zero browser alerts.

---

## ✨ Key Features

### 🔐 Authentication & Security
- **BetterAuth + MongoDB Adapter:** Supports Email/Password authentication and **Google OAuth** social login backed directly by MongoDB Atlas.
- **Live Password Strength Validation:** Real-time checklist on registration enforcing at least one uppercase letter, one lowercase letter, and a minimum of 6 characters.
- **JWT Protected Express API:** A secure Next.js JWT bridge (`/api/jwt`) verifies the active BetterAuth session cookie and issues signed tokens checked by Express `verifyToken` middleware on every private endpoint.
- **Reload-Safe Private Routes:** Custom `PrivateRoute` guard preserves authenticated state across hard browser refreshes on `/add-book`, `/my-books`, `/my-borrows`, `/books/:id`, and `/profile`, while redirecting guests back to their intended destination after login.
- **Ownership Verification:** Server-side checks ensure users can only edit or delete books they personally contributed, and only return their own borrowed records (`403 Forbidden` otherwise).

### 📚 Library CRUD & Borrowing Engine
- **Atomic Copy Tracking (`$inc`):** Borrowing a book atomically decrements `totalCopies` by `1` only when stock is greater than `0`; returning a book restores `totalCopies` by `1`. When copies hit `0`, the borrow button automatically disables with a **"Not Available"** badge.
- **Double-Borrow Prevention:** Backend conflict checks (`409 Conflict`) prevent the same user from borrowing two copies of the same title simultaneously, showing an instant toast message.
- **Cloud Cover Uploads via ImgBB:** Users upload book cover photos with live local previews before saving; images are hosted on ImgBB with clean HTTPS URLs stored in MongoDB.
- **Complete Personal Shelf Management (`/my-books`):** View contributed books in a structured table, update details or replace covers in a pre-filled Edit Modal, and remove books via a custom Delete Confirmation Modal (zero native `alert()` or `confirm()` dialogs).
- **Borrowing Dashboard (`/my-borrows`) & Reader Profile (`/profile`):** Track borrow dates, expected return dates, return books with one-click confirmation, and view live personal reading statistics.

### 🎨 Modern Editorial UI & UX
- **Custom Light & Dark Themes:** Persistent DaisyUI themes (`booknook-light` warm paper palette & `booknook-dark` midnight slate) synced with `localStorage`.
- **Smooth Framer Motion Animations:** Reusable scroll-reveal (`FadeUp`) and staggered wave grid animations (`StaggerGrid`, `StaggerItem`) paired with tactile card hover lift effects.
- **Cinematic Swiper.js Hero Slider:** 3-slide fade-transition hero carousel with autoplay, navigation arrows, and direct catalog CTAs.
- **Debounced Search & Category Filtering:** Fast catalog discovery on `/books` with 250ms debounced title/author search and instant category pills (`Fiction`, `Science`, `History`, `Kids`, `Others`).
- **Dynamic Route Metadata & Custom 404:** Automatic route-specific browser titles (`BookNook | All Books`, `BookNook | My Borrows`, etc.), global loading spinners, and a custom 404 page with a **Back to Home** action.

---

## 🏗️ System Architecture & Auth Flow

```text
┌───────────────────────────┐       Session Cookie       ┌──────────────────────────────┐
│   Next.js Client (UI)     │ ◄────────────────────────► │  BetterAuth API (/api/auth)  │
│  App Router + Tailwind v4 │                            │     + MongoDB Adapter        │
└─────────────┬─────────────┘                            └──────────────┬───────────────┘
              │                                                         │
              │ 1. Request JWT (/api/jwt)                               │ Verified Session
              ▼                                                         ▼
┌───────────────────────────┐       Signed Bearer JWT    ┌──────────────────────────────┐
│  Smart Fetch Helper       │ ─────────────────────────► │  Express.js Server (8 APIs)  │
│  (publicFetch / authFetch)│                            │  verifyToken Middleware      │
└───────────────────────────┘                            └──────────────┬───────────────┘
                                                                        │
                                                                        ▼
                                                         ┌──────────────────────────────┐
                                                         │   MongoDB Atlas (booknookDB) │
                                                         │  books | borrows | auth data │
                                                         └──────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | Next.js 16 (App Router, JavaScript), React 19 |
| **Styling & UI** | Tailwind CSS v4, DaisyUI v5, Playfair Display & Plus Jakarta Sans (Google Fonts) |
| **Animations & Media** | Framer Motion, Swiper.js, Lucide React Icons, React Hot Toast |
| **Authentication** | BetterAuth, MongoDB Adapter, Google OAuth 2.0, JSON Web Tokens (JWT) |
| **Backend Server** | Node.js, Express.js (ES Modules), CORS, Dotenv |
| **Database & Storage** | MongoDB Atlas (Native Driver with serverless connection caching), ImgBB API |
| **Deployment** | Vercel (Frontend & Serverless Express API) |

---

## 🗺️ Application Routes

| Route | Access | Description |
| :--- | :--- | :--- |
| `/` | Public | Hero Slider (Swiper.js), Dynamic New Arrivals (latest 6 books), How Borrowing Works, Top Categories |
| `/books` | Public | Complete catalog in a responsive 3-column grid with debounced search & genre filter |
| `/books/[id]` | Private | Full book overview, live copy badge, contributor details, and Borrow Confirmation Modal |
| `/add-book` | Private | Add new book form with ImgBB cover upload, preview, Total Copies, and read-only user info |
| `/my-books` | Private | Manage user's added books with pre-filled Edit Modal and custom Delete Confirmation Modal |
| `/my-borrows` | Private | Table of borrowed books with borrow/return dates and Return Book confirmation workflow |
| `/profile` | Private | Verified member profile showing live count of contributed and currently borrowed books |
| `/login` & `/register` | Public | Email/password forms, live password validation, and Google OAuth login |

---

## 🔌 Backend REST API Reference (8 Core Endpoints)

| Method | Endpoint | Auth | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/books` | Public | Fetch all books (supports `?limit=6`, `?email=`, `?category=`, `?search=`) |
| `GET` | `/books/:id` | JWT | Fetch single book details with ObjectId validation |
| `POST` | `/books` | JWT | Create a new book entry with `totalCopies` and `createdAt` timestamp |
| `PATCH` | `/books/:id` | JWT | Update a book (enforces contributor email ownership) |
| `DELETE` | `/books/:id` | JWT | Delete a book (enforces contributor email ownership) |
| `GET` | `/borrows` | JWT | Fetch all active borrows belonging to the logged-in user |
| `POST` | `/borrows` | JWT | Borrow a book with double-borrow check (`409`) and atomic `$inc: { totalCopies: -1 }` |
| `DELETE` | `/borrows/:id` | JWT | Return a book and restore inventory via atomic `$inc: { totalCopies: 1 }` |

---

## 📁 Client Project Structure

```text
booknook-client/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...all]/route.js   # BetterAuth catch-all handler
│   │   │   └── jwt/route.js             # Session-verified JWT issuer
│   │   ├── add-book/page.jsx            # Add Book route + metadata
│   │   ├── books/
│   │   │   ├── page.jsx                 # All Books catalog route
│   │   │   └── [id]/page.jsx            # Dynamic Book Details route
│   │   ├── login/                       # Login page + route metadata layout
│   │   ├── register/                    # Register page + route metadata layout
│   │   ├── my-books/page.jsx            # Manage user's books
│   │   ├── my-borrows/page.jsx          # Borrowed books & return actions
│   │   ├── profile/page.jsx             # Reader profile & live stats
│   │   ├── layout.js                    # Root layout, fonts, Navbar, Footer, Toaster
│   │   ├── loading.jsx                  # Global route transition spinner
│   │   ├── not-found.jsx                # Custom 404 page
│   │   └── page.js                      # Home page assembly
│   ├── components/
│   │   ├── auth/PrivateRoute.jsx        # Reload-safe route guard
│   │   ├── books/                       # AddBookClient, AllBooksClient, MyBooksClient, BookDetailsClient
│   │   ├── borrows/MyBorrowsClient.jsx  # Borrow table + Return confirmation modal
│   │   ├── home/                        # HeroSlider, NewArrivals, ExtraSections
│   │   ├── layout/                      # Navbar (theme toggle + dropdown), Footer (X logo)
│   │   ├── profile/ProfileClient.jsx    # Reader dashboard
│   │   └── ui/                          # BookCard, MotionPrimitives
│   └── lib/
│       ├── api.js                       # publicFetch & auto-JWT authFetch helpers
│       ├── auth.js                      # BetterAuth + MongoDB Adapter server config
│       ├── auth-client.js               # BetterAuth React hooks
│       ├── imgbb.js                     # ImgBB image upload utility
│       └── mongodb.js                   # Cached MongoDB client
├── next.config.mjs
├── postcss.config.mjs
└── package.json
```

---

## 🚀 Run Locally

### Prerequisites
- **Node.js** v18+
- **MongoDB Atlas** cluster URI
- **Google Cloud Console** OAuth 2.0 credentials
- **ImgBB** free API key

### 1. Clone & Start the Backend (`booknook-server`)
```bash
git clone [https://github.com/YOUR_GITHUB_USERNAME/booknook-server.git](https://github.com/YOUR_GITHUB_USERNAME/booknook-server.git)
cd booknook-server
npm install
```

Create a `.env` file in `booknook-server`:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_uri
JWT_SECRET=your_shared_jwt_secret
CLIENT_URL=http://localhost:3000
```

Start the Express server:
```bash
npm run dev
```

### 2. Clone & Start the Frontend (`booknook-client`)
```bash
git clone [https://github.com/YOUR_GITHUB_USERNAME/booknook-client.git](https://github.com/YOUR_GITHUB_USERNAME/booknook-client.git)
cd booknook-client
npm install
```

Create a `.env.local` file in `booknook-client`:
```env
MONGODB_URI=your_mongodb_atlas_connection_uri
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

JWT_SECRET=your_shared_jwt_secret
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

Start the Next.js development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💡 Engineering Challenges Solved

1. **Preventing Race Conditions on Last Copy:** Instead of reading `totalCopies` in JavaScript and writing back `totalCopies - 1`, `POST /borrows` uses a conditional atomic MongoDB update (`{ _id, totalCopies: { $gt: 0 } }` with `{ $inc: { totalCopies: -1 } }`), guaranteeing stock never drops below zero even under simultaneous requests.
2. **Bridging Next.js BetterAuth & Standalone Express API:** Implemented a dedicated `/api/jwt` endpoint that validates BetterAuth's HTTP-only session server-side before minting a signed JWT, paired with automatic 401 token refresh inside `authFetch`.
3. **Eliminating Reload Redirect Glitches:** Designed `PrivateRoute` to wait until BetterAuth's `isPending` state resolves before evaluating authentication, ensuring hard reloads on any private page keep logged-in users in place.

---

## 👨‍💻 Author

**Mahfujur Rahman Safin**  
Full-Stack JavaScript Web Developer  
[![GitHub](https://img.shields.io/badge/GitHub-Profile-181717?style=flat-square&logo=github)](https://github.com/YOUR_GITHUB_USERNAME)

---

<div align="center">
  <sub>Built with care for readers who love sharing great stories.</sub>
</div>