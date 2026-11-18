import express from "express";
import { ObjectId } from "mongodb";
import { connectDB } from "../config/db.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// 1. GET /books (Public) — supports ?limit=6, ?email=..., ?category=..., ?search=...
router.get("/", async (req, res) => {
  try {
    const db = await connectDB();
    const booksCollection = db.collection("books");

    const { limit, email, category, search } = req.query;
    const filter = {};

    if (email) {
      filter.userEmail = email;
    }
    if (category && category !== "All") {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    let cursor = booksCollection.find(filter).sort({ createdAt: -1 });

    if (limit) {
      const parsedLimit = parseInt(limit, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        cursor = cursor.limit(parsedLimit);
      }
    }

    const books = await cursor.toArray();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books", error: error.message });
  }
});

// 2. GET /books/:id (Private) — Single book details
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book ID format" });
    }

    const db = await connectDB();
    const book = await db.collection("books").findOne({ _id: new ObjectId(id) });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch book details", error: error.message });
  }
});

// 3. POST /books (Private) — Add a new book
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, author, category, image, description, totalCopies } = req.body;

    if (!title || !author || !category || !image || !description) {
      return res.status(400).json({ message: "All book fields are required" });
    }

    const parsedCopies = parseInt(totalCopies, 10);
    if (isNaN(parsedCopies) || parsedCopies < 1) {
      return res.status(400).json({ message: "Total copies must be at least 1" });
    }

    const newBook = {
      title: title.trim(),
      author: author.trim(),
      category,
      image,
      description: description.trim(),
      totalCopies: parsedCopies,
      userName: req.user.name || req.body.userName || "Reader",
      userEmail: req.user.email,
      createdAt: new Date(),
    };

    const db = await connectDB();
    const result = await db.collection("books").insertOne(newBook);

    res.status(201).json({
      message: "Book added successfully",
      insertedId: result.insertedId,
      book: { _id: result.insertedId, ...newBook },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add book", error: error.message });
  }
});

// 4. PATCH /books/:id (Private) — Update user's own book
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book ID format" });
    }

    const db = await connectDB();
    const booksCollection = db.collection("books");

    const existingBook = await booksCollection.findOne({ _id: new ObjectId(id) });
    if (!existingBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (existingBook.userEmail !== req.user.email) {
      return res.status(403).json({ message: "Forbidden: You can only edit your own books" });
    }

    const { title, author, category, image, description, totalCopies } = req.body;
    const updateFields = {};

    if (title) updateFields.title = title.trim();
    if (author) updateFields.author = author.trim();
    if (category) updateFields.category = category;
    if (image) updateFields.image = image;
    if (description) updateFields.description = description.trim();
    if (totalCopies !== undefined) {
      const parsedCopies = parseInt(totalCopies, 10);
      if (isNaN(parsedCopies) || parsedCopies < 0) {
        return res.status(400).json({ message: "Total copies cannot be negative" });
      }
      updateFields.totalCopies = parsedCopies;
    }

    await booksCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    res.status(200).json({ message: "Book updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update book", error: error.message });
  }
});

// 5. DELETE /books/:id (Private) — Delete user's own book
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book ID format" });
    }

    const db = await connectDB();
    const booksCollection = db.collection("books");

    const existingBook = await booksCollection.findOne({ _id: new ObjectId(id) });
    if (!existingBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (existingBook.userEmail !== req.user.email) {
      return res.status(403).json({ message: "Forbidden: You can only delete your own books" });
    }

    await booksCollection.deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete book", error: error.message });
  }
});

export default router;