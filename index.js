import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import booksRouter from "./routes/books.js";
import borrowsRouter from "./routes/borrows.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow localhost + deployed frontend origins
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Blocked by CORS policy"));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Health check route
app.get("/", async (req, res) => {
  try {
    await connectDB();
    res.status(200).json({
      status: "ok",
      service: "BookNook Library API",
      database: "connected",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Mount the 8 core API routes
app.use("/books", booksRouter);
app.use("/borrows", borrowsRouter);

// Run locally only (Vercel handles serverless exports automatically)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`BookNook server running on http://localhost:${PORT}`);
  });
}

export default app;