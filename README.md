# Scatch 🛍️

Scatch is a full-stack **product-selling web application** built with **Node.js, Express.js, MongoDB, and EJS**.

The project focuses on building a complete server-side e-commerce workflow with user authentication, product management, shopping cart, wishlist, and order-related functionality.

## 🚀 Features

- User registration and login
- User authentication and protected routes
- Owner/Admin authentication
- Product creation and management
- Product image upload using Multer
- Product listing
- Product details page
- Shopping cart
- Wishlist
- Checkout flow
- Order management
- Session-based authentication
- MongoDB database integration
- Server-side rendering using EJS
- Custom Express middleware for authentication and authorization

## 🛠️ Tech Stack

### Backend

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**

### Frontend

- **EJS**
- **HTML**
- **CSS**
- **JavaScript**

### Libraries & Tools

- **Multer** — Image upload handling
- **Express Session** — Session management
- **JWT** — Token generation
- **bcrypt** — Password hashing
- **Git & GitHub**

## 📂 Project Structure

```text
Scatch/
│
├── config/
│   ├── mongoose-connection.js
│   └── multer-config.js
│
├── controllers/
│   └── authController.js
│
├── middlewares/
│   ├── isLoggedin.js
│   └── isOwner.js
│
├── models/
│   ├── product-model.js
│   └── user-model.js
│
├── routes/
│   ├── index.js
│   ├── ownersRouter.js
│   ├── productsRouter.js
│   └── usersRouter.js
│
├── utils/
│   ├── bagImages.js
│   ├── generateToken.js
│   └── seedProducts.js
│
├── views/
│   ├── partials/
│   ├── account.ejs
│   ├── admin.ejs
│   ├── cart.ejs
│   ├── checkout.ejs
│   ├── createproducts.ejs
│   ├── index.ejs
│   ├── orders.ejs
│   ├── owner-login.ejs
│   ├── product-details.ejs
│   ├── shop.ejs
│   └── wishlist.ejs
│
├── app.js
├── package.json
├── package-lock.json
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Manishcodebuzzer/Scatch.git
cd Scatch
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory.

```env
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
JWT_KEY=your_jwt_secret
```

> **Important:** Never commit your `.env` file or any database credentials to GitHub.

### 4. Start the application

For development:

```bash
npm run dev
```

For production:

```bash
npm start
```

The application will run on:

```text
http://localhost:3000
```

## 🔐 Authentication & Authorization

Scatch implements authentication and authorization using Express middleware.

The application provides separate functionality for:

- **Users** — Browse products, manage cart and wishlist, and place orders.
- **Owners/Admins** — Manage and create products.

Protected routes are handled using custom middleware.

## 🗄️ Database

Scatch uses **MongoDB** with **Mongoose** for data management.

The application stores information related to:

- Users
- Products
- Cart
- Wishlist
- Orders

## 📸 Screenshots

Screenshots of the application will be added here.

## 🌐 Deployment

The project is currently being prepared for deployment.

Planned deployment stack:

- **Application:** Node.js + Express.js
- **Database:** MongoDB Atlas
- **Image Storage:** Cloud-based storage
- **Hosting:** Cloud deployment platform

Live demo will be added after deployment.

## 🔮 Future Improvements

- Deploy the application
- MongoDB Atlas integration
- Cloud-based image storage
- Payment gateway integration
- Product search and filtering
- Pagination
- Improved input validation
- Centralized error handling
- Automated testing
- API documentation
- Improved security

## 👨‍💻 Author

**Manish Singh**

BTech Information Technology Student

- GitHub: https://github.com/Manishcodebuzzer
- LinkedIn: https://www.linkedin.com/in/manish-singh-44564a383/

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.