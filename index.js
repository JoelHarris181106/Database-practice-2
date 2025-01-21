const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT ||3000;

// Sample data - books array to act as our database
const books = require("./data.json")

// CREATE: Add a new book
app.post('/books', (req, res) => {
  const { book_id, title, author, genre, year, copies } = req.body;
  
  if (!book_id || !title || !author || !genre || !year || !copies) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Check if book_id already exists
  const existingBook = books.find(book => book.book_id === book_id);
  if (existingBook) {
    return res.status(400).json({ message: 'A book with this ID already exists.' });
  }

  // Add the new book
  const newBook = { book_id, title, author, genre, year, copies };
  books.push(newBook);
  res.status(201).json(newBook);
});

// READ: Get all books
app.get('/books', (req, res) => {
  res.status(200).json(books);
});

// READ: Get a specific book by ID
app.get('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const book = books.find(book => book.book_id === bookId);

  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  res.status(200).json(book);
});

// UPDATE: Update a book's details
app.put('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const { title, author, genre, year, copies } = req.body;

  const book = books.find(book => book.book_id === bookId);
  
  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  // Update the book's details
  if (title) book.title = title;
  if (author) book.author = author;
  if (genre) book.genre = genre;
  if (year) book.year = year;
  if (copies) book.copies = copies;

  res.status(200).json(book);
});

// DELETE: Remove a book from the library
app.delete('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const index = books.findIndex(book => book.book_id === bookId);

  if (index === -1) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  books.splice(index, 1);
  res.status(200).json({ message: 'Book deleted successfully.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
