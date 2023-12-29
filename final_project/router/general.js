const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required for registration." });
  }

  // Check if the username already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(409).json({ message: "Username already exists. Please choose another username." });
  }

  // If everything is valid, create a new user
  const newUser = { username, password };
  users.push(newUser);

  return res.status(201).json({ message: "User registered successfully", user: newUser });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const bookList = Object.values(books).map(book => ({
    title: book.title,
    author: book.author,
    isbn: book.isbn
    
  }))
  return res.status(200).json({ books: JSON.stringify(bookList, null, 2) });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const requestedISBN = req.params.isbn;

  // Find the book with the matching ISBN
  const bookWithISBN = Object.values(books).find(book => book.isbn === requestedISBN);

  if (bookWithISBN) {
    return res.status(200).json({ book: bookWithISBN });
  } else {
    return res.status(404).json({ message: 'Book not found' });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const requestedAuthor = req.params.author;
  const booksArray = Object.values(books);
  
  // Filter books based on the provided author
  const booksByAuthor = booksArray.filter(book => book.author === requestedAuthor);

  if (booksByAuthor.length > 0) {
    return res.status(200).json({ books: booksByAuthor });
  } else {
    return res.status(404).json({ message: 'Books by this author not found' });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const requestedTitle=req.params.title;
  const titlesArray=Object.values(books);
  const titles=titlesArray.filter(book=>book.title===requestedTitle);

  if(titles.length>0){
    return res.status(200).json({ books: titles });
  }else{
    return res.status(404).json({ message: 'Title not found' });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const requestedReview = req.params.isbn;
  const book = Object.values(books).find(book => book.isbn === requestedReview);

  if (book && book.reviews && book.reviews.length > 0) {
    return res.status(200).json({ reviews: book.reviews });
  } else {
    return res.status(404).json({ message: 'Reviews for this book not found' });
    }
});

module.exports.general = public_users;
