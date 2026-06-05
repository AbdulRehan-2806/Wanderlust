# Wanderlust

Wanderlust is a full-stack vacation rental platform inspired by Airbnb. Users can browse properties, search destinations, filter listings by category, upload listing images, leave reviews, and securely manage their own listings through authentication and authorization.

## Project Highlights

- Secure Authentication & Authorization
- Cloudinary Image Uploads
- Search Functionality
- Category Filters
- Review & Rating System
- Responsive Design

## Features

- User Authentication (Sign Up / Login / Logout)
- Authorization for Listings and Reviews
- Create, Edit and Delete Listings
- Upload Listing Images using Cloudinary
- Add and Delete Reviews
- Category-Based Filtering
- Search Listings by Title, Location, and Country
- Flash Messages for User Feedback
- Session Management using Express Session
- Responsive UI using Bootstrap
- MVC Architecture

## Tech Stack

### Frontend
- HTML
- CSS
- Bootstrap 5
- EJS

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- Passport.js
- Passport Local

### Image Storage
- Cloudinary
- Multer
- Multer Storage Cloudinary

### Other Tools
- Express Session
- Connect Flash
- Joi Validation
- Method Override

## Screenshots

### Home Page

![Home Page](public/screenshots/home.png)

### Listing Details

![Listing Details](public/screenshots/listing-details.png)

### Search Functionality

![Search Functionality](public/screenshots/search.png)

### Category Filtering

![Category Filtering](public/screenshots/filter.png)

### Login Page

![Login Page](public/screenshots/login.png)

### Create Listing

![Create Listing](public/screenshots/create-listing.png)

## Project Structure

```text
Wanderlust/
│
├── controllers/
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
│
├── models/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── routes/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── views/
│   ├── includes/
│   │   ├── navbar.ejs
│   │   ├── footer.ejs
│   │   └── flash.ejs
│   │
│   ├── layouts/
│   │   └── boilerplate.ejs
│   │
│   ├── listings/
│   │   ├── index.ejs
│   │   ├── show.ejs
│   │   ├── new.ejs
│   │   └── edit.ejs
│   │
│   ├── users/
│   │   ├── signup.ejs
│   │   └── login.ejs
│   │
│   └── error.ejs
│
├── public/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   └── script.js
│   │
│   └── screenshots/
│
├── init/
│   ├── data.js
│   └── index.js
│
├── utils/
│   ├── ExpressError.js
│   └── wrapAsync.js
│
├── middleware.js
├── cloudConfig.js
├── schema.js
├── app.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Architecture

The application follows the MVC (Model-View-Controller) architecture:

- Models manage MongoDB data and schema definitions.
- Views render dynamic UI using EJS templates.
- Controllers contain business logic.
- Routes define application endpoints and connect requests to controllers.
- Middleware handles authentication, authorization, validation, and error handling.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AbdulRehan-2806/Wanderlust.git
   cd Wanderlust
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the application:

   ```bash
   node app.js
   ```
4. Open your browser and navigate to `http://localhost:8080` to access the application.

## Environment Variables

    Create a `.env` file in the root directory and add the following variables:

    ```env
    SECRET=your_secret_key
    CLOUD_NAME=your_cloud_name
    CLOUD_API_KEY=your_cloud_api_key
    CLOUD_API_SECRET=your_cloud_api_secret
    ```

## Future Improvements
    - Wishlist / Favorites Functionality
    - Booking and Reservation System
    - Payment Gateway Integration
    - Interactive Maps Integration

## Author
   - Abdul Rehan
   - GitHub: https://github.com/AbdulRehan-2806
   This project was developed to gain hands-on experience in full-stack web development using Node.js, Expressjs, MongoDB, Passport.js, Cloudinary, and the MVC architecture.