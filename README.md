<div align="center">

# 📚 BookNook — Backend REST API

Express.js & MongoDB REST API powering **BookNook**, a full-stack online community library.

[![Live API](https://img.shields.io/badge/Live_API-Vercel-0f4c3a?style=for-the-badge&logo=vercel&logoColor=white)](https://YOUR_LIVE_SERVER_URL.vercel.app)
[![Live Frontend](https://img.shields.io/badge/Live_Website-BookNook-b45309?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://YOUR_LIVE_CLIENT_URL.vercel.app)
[![Client Repo](https://img.shields.io/badge/Client_Code-GitHub-1c1917?style=for-the-badge&logo=github&logoColor=white)](https://github.com/mahfuj-safin/PH-A-08-CLIENT)

</div>

---

## 🚀 Core Features
- **8 RESTful Endpoints:** Modular Express routing split cleanly into `books` and `borrows` modules.
- **JWT Route Protection:** Dedicated `verifyToken` middleware validates signed Bearer tokens issued by the Next.js BetterAuth bridge.
- **Atomic Copy Management (`$inc`):** Borrowing decrements `totalCopies` only when `totalCopies > 0`; returning restores it by `+1`.
- **Double-Borrow Prevention:** Rejects duplicate active borrows per user/book with `409 Conflict`.
- **Ownership Guard:** Restricts book edits (`PATCH`) and deletions (`DELETE`) strictly to the original contributor (`403 Forbidden`).
- **Serverless MongoDB Caching:** Caches the MongoDB client instance across warm Vercel serverless invocations.

## 🔌 API Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Public | Health & MongoDB connection check |
| `GET` | `/books` | Public | Fetch books (`?limit=6`, `?email=`, `?category=`, `?search=`) |
| `GET` | `/books/:id` | JWT | Fetch single book details |
| `POST` | `/books` | JWT | Add a new book with initial `totalCopies` |
| `PATCH` | `/books/:id` | JWT | Update contributor's own book |
| `DELETE` | `/books/:id` | JWT | Delete contributor's own book |
| `GET` | `/borrows` | JWT | Get logged-in user's active borrows |
| `POST` | `/borrows` | JWT | Borrow a book (`$inc: -1` + no double borrow) |
| `DELETE` | `/borrows/:id` | JWT | Return a book (`$inc: +1`) |

## 🛠️ Environment Variables

env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_shared_jwt_secret
CLIENT_URL=http://localhost:3000,https://YOUR_LIVE_CLIENT_URL.vercel.app
NODE_ENV=production


## 💻 Run Locally


git clone [https://github.com/mahfuj-safin/PH-A-08-SERVER.git](https://github.com/mahfuj-safin/PH-A-08-SERVER.git)
cd PH-A-08-SERVER
npm install
npm run dev
