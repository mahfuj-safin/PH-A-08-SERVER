import express from "express";
import { ObjectId } from "mongodb";
import { connectDB } from "../config/db.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// 6. GET /borrows (Private) — Get all borrowed books for logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();
    const borrows = await db
      .collection("borrows")
      .find({ userEmail: req.user.email })
      .sort({ borrowDate: -1 })
      .toArray();

    res.status(200).json(borrows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch borrowed books", error: error.message });
  }
});

// 7. POST /borrows (Private) — Borrow a book with No Double Borrow + $inc (-1)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { bookId, returnDate } = req.body;

    if (!bookId || !ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Valid Book ID is required" });
    }

    const db = await connectDB();
    const booksCollection = db.collection("books");
    const borrowsCollection = db.collection("borrows");

    const bookObjectId = new ObjectId(bookId);
    const book = await booksCollection.findOne({ _id: bookObjectId });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Challenge: No Double Borrow check
    const alreadyBorrowed = await borrowsCollection.findOne({
      bookId: bookId,
      userEmail: req.user.email,
    });

    if (alreadyBorrowed) {
      return res.status(409).json({
        message: "You have already borrowed this book. Return it first to borrow again.",
      });
    }

    // Challenge: Atomic decrement with $inc only if totalCopies > 0
    const decrementResult = await booksCollection.updateOne(
      { _id: bookObjectId, totalCopies: { $gt: 0 } },
      { $inc: { totalCopies: -1 } }
    );

    if (decrementResult.modifiedCount === 0) {
      return res.status(400).json({ message: "This book is currently not available" });
    }

    // Default return date: 14 days from today if not provided
    const borrowDate = new Date();
    const finalReturnDate = returnDate
      ? new Date(returnDate)
      : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    const borrowRecord = {
      bookId: bookId,
      bookTitle: book.title,
      bookImage: book.image,
      bookAuthor: book.author,
      userName: req.user.name || "Reader",
      userEmail: req.user.email,
      borrowDate,
      returnDate: finalReturnDate,
    };

    const result = await borrowsCollection.insertOne(borrowRecord);

    res.status(201).json({
      message: "Book borrowed successfully",
      insertedId: result.insertedId,
      borrow: { _id: result.insertedId, ...borrowRecord },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to borrow book", error: error.message });
  }
});

// 8. DELETE /borrows/:id (Private) — Return a book + $inc (+1)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid borrow record ID" });
    }

    const db = await connectDB();
    const borrowsCollection = db.collection("borrows");
    const booksCollection = db.collection("books");

    const borrowRecord = await borrowsCollection.findOne({ _id: new ObjectId(id) });
    if (!borrowRecord) {
      return res.status(404).json({ message: "Borrow record not found" });
    }

    if (borrowRecord.userEmail !== req.user.email) {
      return res.status(403).json({ message: "Forbidden: You can only return your own borrowed books" });
    }

    // Remove from borrows collection
    await borrowsCollection.deleteOne({ _id: new ObjectId(id) });

    // Challenge: Increase book copies back by 1 using $inc
    if (ObjectId.isValid(borrowRecord.bookId)) {
      await booksCollection.updateOne(
        { _id: new ObjectId(borrowRecord.bookId) },
        { $inc: { totalCopies: 1 } }
      );
    }

    res.status(200).json({ message: "Book returned successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to return book", error: error.message });
  }
});

export default router;