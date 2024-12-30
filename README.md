# Library Management System

A React-based library management system with user and admin functionalities.

## Borrowed Books Feature

### User View
Users can:
- View their currently borrowed books
- See book details including:
  - Title
  - Author
  - Borrow date
  - Due date
  - Return status
- Return books directly from their profile
- Receive success notifications upon returning books

### Admin View
Admins can:
- View borrowed books for any user
- Access detailed borrowing history
- Track:
  - Book title
  - Borrower information
  - Borrow dates
  - Due dates
  - Return status

## API Endpoints

### User Endpoints

```
Authentication
POST /login # Login user
POST /register # Register new user

Profile Management
GET /user/profile # Get user profile
PUT /user/profile # Update user profile

Book Operations
GET /user/available-books # Get all available books
GET /user/find-books-by-book-title?title={title} # Search books by title
GET /user/find-books-by-author?author={author} # Search books by author
GET /user/find-book-by-genre?genre={genre} # Search books by genre
POST /user/borrow/{bookId} # Borrow a book
POST /user/return/{borrowedBookId} # Return a borrowed book
```

### Admin Endpoints
```
User Management
GET /admin/users # Get all users
GET /admin/get-user-profile/{userId} # Get specific user profile
Book Management
GET /admin/borrowed-books # Get all borrowed books
GET /admin/borrowed-books/{username} # Get specific user's borrowed books
GET /admin/overdue-books # Get all overdue books
```


Each endpoint requires appropriate authentication:
- User endpoints require USER role token
- Admin endpoints require ADMIN role token
- Authentication is handled via JWT tokens in the Authorization header


