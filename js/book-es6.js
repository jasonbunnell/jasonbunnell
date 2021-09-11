// Users ES6 classes for methods

class Book {
   constructor(title, author, isbn) {
      this.title = title
      this.author = author
      this.isbn = isbn
   }
}

class UI {
   addBookToList(book){
      const list = document.getElementById('book-list');
      // create element
      const row = document.createElement('tr');
      // insert cols
      row.innerHTML = `
         <td>${book.title}</td>
         <td>${book.author}</td>
         <td>${book.isbn}</td>
         <td><a href="#" class="delete">X</a></td>`;
   
      list.appendChild(row);
   }

   showAlert(message, className){
      // create div
      const div = document.createElement('div');
      // add classes
      div.className = `alert ${className}`;
      // add text
      div.appendChild(document.createTextNode(message));
      // get parent
      const container = document.querySelector('.container');
      const form = document.querySelector('#book-form');
      container.insertBefore(div,form);
      // disappear after 3 seconds
      setTimeout(function(){
         document.querySelector('.alert').remove();
      }, 3000);
   }

   deleteBook(target){
      if(target.className === 'delete'){
         target.parentElement.parentElement.remove();
      }
   }

   clearFields(){
      document.getElementById('title').value = '';
      document.getElementById('author').value = '';
      document.getElementById('isbn').value = '';
   }
}

// LOCAL STORAGE CLASS
class Store {
   static getBooks() {
      let books
      if(localStorage.getItem('books') === null) {
         books = []
      } else {
         books = JSON.parse(localStorage.getItem('books'));
      }

      return books
   }
   
   static displayBooks() {
      const books = Store.getBooks()
      books.forEach(function(book){
         const ui = new UI
         // add book to ui
         ui.addBookToList(book)
      })
   }

   static addBook(book){
      const books = Store.getBooks()
      books.push(book)
      localStorage.setItem('books', JSON.stringify(books))
   }

   static removeBook(isbn, index){
      const books = Store.getBooks()
      books.forEach(function(book){
         if(book.isbn === isbn){
            books.splice(index, 1)
         }
      })
      localStorage.setItem('books', JSON.stringify(books))
   }
}

// EVENT LISTENER - Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks)

// EVENT LISTENER - SUBMIT
document.getElementById('book-form').addEventListener('submit', function(e){
   // get form values
   const title = document.getElementById('title').value,
      author = document.getElementById('author').value,
      isbn = document.getElementById('isbn').value

   // instantiate book   
   const book = new Book(title, author, isbn);

   // instantiate UI
   const ui = new UI();

   // Validate
   if(title === '' || author === '' || isbn === ''){
      // error alert
      ui.showAlert('FAIL!  Must fill in all fields!', 'error');
   } else {
      // add book to list
      ui.addBookToList(book);

      // add to local storage
      Store.addBook(book);

      // show success alert
      ui.showAlert('Book Added', 'success');

      // clear fields
      ui.clearFields();
   }

   e.preventDefault();
});

// EVENT LISTENER - DELETE
document.getElementById('book-list').addEventListener('click', function(e){
   
   // instantiate UI
   const ui = new UI();

   // delete book
   ui.deleteBook(e.target);

   // remove from local storage
   Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

   // Show message
   ui.showAlert('Book removed!', 'success');

   e.preventDefault();
})