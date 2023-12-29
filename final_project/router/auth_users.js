const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { username: 'sapo', password: 'sapo' },
];

const isValid = (username)=>{ //returns boolean
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.some(user => user.username === username && user.password === password);
}
const secretKey = 'Key';

regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required for login." });
  }


  if (authenticatedUser(username, password)) {

    const token = jwt.sign({ username: username }, secretKey);
    return res.status(200).json({ message: "Login successful", token: token });
  } else {
    return res.status(401).json({ message: "Invalid username or password." });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const token = req.headers.authorization; 

  if (!token) {
    return res.status(401).json({ message: "Token is missing. Please login to add or modify a review." });
  }

  try {
    // Verificar el token y obtener el usuario de la sesión
    const decoded = jwt.verify(token, secretKey);
    const currentUser = decoded.username;

    const isbn = req.params.isbn;
    const reviewText = req.query.review; 


    const book = books[isbn];

    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    // Verificar si el usuario en sesión ya ha revisado este libro
    if (book.reviews && book.reviews[currentUser]) {
      // Modificar la revisión existente del usuario en sesión para este ISBN
      book.reviews[currentUser] = reviewText;
      return res.status(200).json({ message: "Review modified successfully." });
    } else {
      // Agregar una nueva revisión para el usuario en sesión para este ISBN
      if (!book.reviews) {
        book.reviews = {};
      }
      book.reviews[currentUser] = reviewText;
      return res.status(200).json({ message: "Review added successfully." });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token. Please login again." });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Token is missing. Please login to delete a review." });
  }

  try {

    const decoded = jwt.verify(token, secretKey);
    const currentUser = decoded.username; 

    const isbn = req.params.isbn;


    const book = books[isbn];

    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }


    if (book.reviews && book.reviews[currentUser]) {

      delete book.reviews[currentUser];
      return res.status(200).json({ message: "Review deleted successfully." });
    } else {
      return res.status(404).json({ message: "Review not found or you are not authorized to delete this review." });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token. Please login again." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
