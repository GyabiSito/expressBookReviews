const axios = require('axios');

const getBooks = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:5000/books')
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

getBooks()
  .then(books => {
    console.log(books);
  })
  .catch(error => {
    console.error(error);
  });

  

public_users.get('/isbn/:isbn', function (req, res) {
  const requestedISBN = req.params.isbn;

  axios.get(`http:/localhost:5000/books/isbn/${requestedISBN}`)
    .then(response => {
      res.status(200).json({ book: response.data });
    })
    .catch(error => {
      res.status(404).json({ message: 'Book not found' });
    });
});

public_users.get('/author/:author', function (req, res) {
    const requestedAuthor = req.params.author;
  
    axios.get(`http:/localhost:5000/books/author/${requestedAuthor}`)
      .then(response => {
        res.status(200).json({ books: response.data });
      })
      .catch(error => {
        res.status(404).json({ message: 'Books by this author not found' });
      });
  });
  

  public_users.get('/title/:title', function (req, res) {
    const requestedTitle = req.params.title;
  
    axios.get(`http:/localhost:5000/books/title/${requestedTitle}`)
      .then(response => {
        res.status(200).json({ books: response.data });
      })
      .catch(error => {
        res.status(404).json({ message: 'Title not found' });
      });
  });
  