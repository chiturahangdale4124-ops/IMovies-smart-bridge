# IMovies – Movie Ticket Booking Made Simple 🎬🍿

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-red.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Bootstrap%205-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%7C%20Mongoose-brightgreen.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-black.svg)]()

> A full-stack, enterprise-grade movie ticketing platform crafted with a modern dark cinematic aesthetic, real-time interactive cinema seat mapping, and concurrency-safe atomic ticket reservations.

---

## 1. Project Introduction

**IMovies** is a comprehensive, production-grade online movie ticket booking platform designed to mirror commercial services like BookMyShow, AMC Theatres, and Fandango. Built entirely on the modern **MERN stack** (MongoDB, Express.js, React.js, Node.js) with Bootstrap 5, it delivers a high-impact cinematic user experience coupled with rock-solid server-side data integrity.

---

## 2. Project Objectives

- **Frictionless Booking Experience**: Allow users to discover premier movies, watch trailers, filter by genres, and book seats in seconds.
- **Race Condition Prevention**: Enforce backend-level atomic seat reservation to prevent duplicate seat bookings across concurrent users.
- **Visual Cinema Seating Layout**: Interactive cinema screen perspective with VIP, Gold, and Silver seating tiers.
- **Full Administrative Control**: Provide theatre managers and administrators with complete CRUD capabilities over movies, cinemas, showtimes, live seat maps, and customer reservations.
- **Zero-Friction Evaluation**: Built-in zero-config embedded MongoDB fallback engine and one-click demo credentials for effortless evaluation.

---

## 3. Features

### User Capabilities
- 🌟 **Dark Cinematic UI**: Sleek dark navy/obsidian theme (`#080c14`), cinema-red accents (`#e50914`), glassmorphism card surfaces, and smooth transitions.
- 🎞️ **Blockbuster Showcase & Hero Section**: Featured premier movies with backdrop banners, ratings, certification badges, and YouTube trailer modal player.
- 🔍 **Instant Search & Filtering**: Multi-genre ribbon filters (Action, Sci-Fi, Drama, Animation, etc.) and real-time title/synopsis search.
- 📅 **Dynamic Date Selector Ribbon**: Browse showtimes across today, tomorrow, and upcoming days.
- 💺 **Interactive Cinema Seat Matrix**: Visual curved screen indicator ("SCREEN THIS WAY"), row letters (A–H), categorized pricing (VIP Recliner, Gold, Silver), and real-time price calculation.
- 🛡️ **Race-Condition Safe Booking**: MongoDB atomic condition matching ensures no two users can book identical seats simultaneously.
- 🎟️ **Instant Digital E-Tickets**: Unique booking references (e.g. `IMOV-XXXXX`), QR/barcode representation, and print-ready receipts.
- 📜 **My Bookings & History**: View upcoming and past reservations with full cancellation and automatic seat release.

### Administrative Capabilities
- 📊 **Executive Dashboard Overview**: Live platform metrics for Total Movies, Theatres, Scheduled Shows, Bookings, and Total Revenue.
- 🎥 **Movies Management**: Add, update, and delete movies with posters, banners, genres, durations, ratings, and YouTube trailer URLs.
- 🏛️ **Theatres Management**: Manage multiplex locations, screens (IMAX Laser, 4DX, Dolby Atmos), and cinema amenities.
- 🕒 **Showtime Scheduling**: Schedule movies to screens and dates with automatic generation of 64-seat layouts and tiered pricing.
- 🪑 **Seat Layout Inspector**: Inspect real-time booked vs available seat maps for any active show.
- 📋 **Booking & User Auditing**: Monitor all customer transactions and user accounts platform-wide.

---

## 4. Technology Stack

### Frontend
- **HTML5 & CSS3**
- **JavaScript (ES6+)**
- **React.js 19**
- **Bootstrap 5.3 & React-Bootstrap**
- **Bootstrap Icons**
- **React Router DOM v7**
- **Axios** (with token interceptor)

### Backend
- **Node.js (v18+)**
- **Express.js 5**
- **Mongoose 9**
- **JSON Web Tokens (jsonwebtoken)**
- **bcryptjs** (Password hashing)
- **CORS** & **Dotenv**
- **MongoDB Memory Server** (Zero-config embedded fallback engine)

### Database
- **MongoDB** / MongoDB Atlas

---

## 5. System Requirements

- **Operating System**: Windows 10/11, macOS 12+, or Ubuntu 20.04+ Linux
- **Node.js**: v18.0.0 or higher (Tested on Node v24)
- **Package Manager**: npm v9.0.0 or higher
- **Internet Access**: Required for movie poster assets and Google Fonts

---

## 6. Hardware Requirements

- **Processor**: Intel Core i3 / AMD Ryzen 3 or higher
- **Memory (RAM)**: 4 GB minimum (8 GB recommended)
- **Storage**: At least 500 MB free disk space

---

## 7. Software Requirements

- **Web Browser**: Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari (modern versions)
- **Terminal / Shell**: PowerShell, Bash, or Zsh
- **Database**: Local MongoDB service, MongoDB Atlas URI, or embedded in-memory MongoDB (auto-detected)

---

## 8. Project Architecture

The application adopts a decoupled client-server architecture:

```
┌────────────────────────────────────────────────────────┐
│                   React.js Frontend                    │
│      (Vite Dev Server :3000 / Production Build)       │
└───────────────────────────┬────────────────────────────┘
                            │ REST API (JSON / Bearer JWT)
                            ▼
┌────────────────────────────────────────────────────────┐
│                  Express.js Backend                    │
│                 (Node Server :5000)                    │
│   ├── Auth & JWT Verification Middleware               │
│   ├── Business Controllers (Movie, Theatre, Booking)   │
│   └── Atomic Concurrency Seat Reservation Guard        │
└───────────────────────────┬────────────────────────────┘
                            │ Mongoose ODM
                            ▼
┌────────────────────────────────────────────────────────┐
│                 MongoDB Database Engine                │
│    (Local mongod :27017 / MongoDB Atlas / In-Memory)   │
│   ├── Users Collection                                 │
│   ├── Movies Collection                                │
│   ├── Theatres Collection                              │
│   ├── Shows Collection (Embedded Seat Layouts)         │
│   └── Bookings Collection                              │
└────────────────────────────────────────────────────────┘
```

---

## 9. Folder Structure

```
IMovies/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── HeroBanner.jsx
│   │   │   ├── MovieCard.jsx
│   │   │   ├── SeatPicker.jsx
│   │   │   ├── TrailerModal.jsx
│   │   │   ├── BookingSuccessModal.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── MovieDetails.jsx
│   │   │   ├── SeatSelection.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── movieService.js
│   │   │   ├── theatreService.js
│   │   │   ├── showService.js
│   │   │   └── bookingService.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   ├── App.js
│   │   ├── main.jsx
│   │   └── index.js
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── movieController.js
│   │   ├── theatreController.js
│   │   ├── showController.js
│   │   └── bookingController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Movie.js
│   │   ├── Theatre.js
│   │   ├── Show.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── movieRoutes.js
│   │   ├── theatreRoutes.js
│   │   ├── showRoutes.js
│   │   └── bookingRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env
│   ├── .env.example
│   ├── seed.js
│   ├── test-e2e.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

---

## 10. Database Schema

### 1. Users Collection (`User.js`)
| Field | Type | Attributes | Description |
|---|---|---|---|
| `name` | String | Required, Trimmed | Full name of the user |
| `email` | String | Required, Unique, Lowercase | User email address |
| `password` | String | Required, Hashed | bcrypt-hashed password (hidden by default) |
| `role` | String | Enum: `['user', 'admin']` | User privilege level (Default: `'user'`) |
| `createdAt` | Date | Default: `Date.now` | Account creation timestamp |

### 2. Movies Collection (`Movie.js`)
| Field | Type | Attributes | Description |
|---|---|---|---|
| `title` | String | Required, Indexed | Movie title |
| `description` | String | Required | Movie synopsis |
| `poster` | String | Required | High-res poster URL |
| `banner` | String | Required | Wide backdrop banner URL |
| `genre` | [String] | Required | Array of genres (e.g. `["Sci-Fi", "Action"]`) |
| `language` | [String] | Required | Array of languages (e.g. `["English", "Hindi"]`) |
| `duration` | Number | Required | Duration in minutes |
| `rating` | Number | Default: `8.0` (0–10) | IMDb/User rating |
| `votes` | Number | Default: `1250` | Total review votes |
| `releaseDate` | Date | Required | Movie release date |
| `trailerUrl` | String | Optional | YouTube trailer URL |
| `status` | String | Enum: `['now_showing', 'upcoming', 'ended']` | Cinema release status |
| `certification` | String | Default: `'UA 16+'` | Age rating certification |
| `featured` | Boolean | Default: `false` | Featured premiere on homepage banner |

### 3. Theatres Collection (`Theatre.js`)
| Field | Type | Attributes | Description |
|---|---|---|---|
| `name` | String | Required | Multiplex name |
| `location` | String | Required | Cinema address |
| `city` | String | Default: `'Mumbai'` | City |
| `screens` | [Screen] | Subdocument array | Screens (screenNumber, name, soundSystem, totalSeats) |
| `facilities` | [String] | Array | Amenities (Dolby Atmos, IMAX Laser, Recliners, etc.) |

### 4. Shows Collection (`Show.js`)
| Field | Type | Attributes | Description |
|---|---|---|---|
| `movieId` | ObjectId | Ref: `'Movie'`, Required | Reference to Movie document |
| `theatreId` | ObjectId | Ref: `'Theatre'`, Required | Reference to Theatre document |
| `screen` | String | Default: `'Screen 1'` | Screen name |
| `showDate` | String | Required (`YYYY-MM-DD`) | Date of show (e.g. `'2026-11-02'`) |
| `showTime` | String | Required | Time of show (e.g. `'06:30 PM'`) |
| `ticketPrice` | Number | Required | Base ticket price (₹) |
| `seats` | [Seat] | Subdocument array | 64 seats: `{ seatNumber, row, column, category, price, isBooked, bookedBy }` |

### 5. Bookings Collection (`Booking.js`)
| Field | Type | Attributes | Description |
|---|---|---|---|
| `userId` | ObjectId | Ref: `'User'`, Required | Reference to User document |
| `showId` | ObjectId | Ref: `'Show'`, Required | Reference to Show document |
| `movieId` | ObjectId | Ref: `'Movie'`, Required | Reference to Movie document |
| `theatreId` | ObjectId | Ref: `'Theatre'`, Required | Reference to Theatre document |
| `selectedSeats` | [String] | Required | Array of reserved seat codes (e.g. `["A1", "A2"]`) |
| `seatDetails` | [Object] | Subdocument array | Individual seat category & price breakdown |
| `totalAmount` | Number | Required | Total amount paid (₹) including convenience fee |
| `bookingReference` | String | Required, Unique | Unique e-ticket code (e.g. `IMOV-VIP9821`) |
| `bookingStatus` | String | Enum: `['confirmed', 'cancelled']` | Current reservation status |
| `paymentStatus` | String | Enum: `['completed', 'refunded']` | Transaction status |
| `paymentMethod` | String | Default: `'IMovies Instant Checkout'` | Payment method identifier |

---

## 11. API Documentation

### Authentication Endpoints
- `POST /api/auth/register` — Register a new account (`name`, `email`, `password`)
- `POST /api/auth/login` — Sign in and receive JWT token (`email`, `password`)
- `GET /api/auth/me` — Retrieve currently authenticated user profile (Private)
- `GET /api/auth/users` — Retrieve all registered users (Admin Only)

### Movies Endpoints
- `GET /api/movies` — List movies with optional query filters: `?status=now_showing`, `?genre=Action`, `?search=dune`
- `GET /api/movies/:id` — Get single movie details
- `POST /api/movies` — Create new movie (Admin Only)
- `PUT /api/movies/:id` — Update existing movie (Admin Only)
- `DELETE /api/movies/:id` — Delete movie and associated showtimes (Admin Only)

### Theatres Endpoints
- `GET /api/theatres` — List all cinemas
- `GET /api/theatres/:id` — Get single cinema details
- `POST /api/theatres` — Create cinema theatre (Admin Only)
- `PUT /api/theatres/:id` — Update cinema details (Admin Only)
- `DELETE /api/theatres/:id` — Delete theatre and associated showtimes (Admin Only)

### Shows Endpoints
- `GET /api/shows` — List scheduled shows with filters: `?movieId=...&showDate=...&theatreId=...`
- `GET /api/shows/:id` — Get single show information
- `GET /api/shows/:id/seats` — Get live cinema seat matrix, pricing, and availability
- `POST /api/shows` — Schedule new show with generated seat layout (Admin Only)
- `DELETE /api/shows/:id` — Remove scheduled show (Admin Only)

### Bookings Endpoints
- `POST /api/bookings` — Reserve seats atomically with duplicate prevention (Private)
- `GET /api/bookings/my-bookings` — Get authenticated user's booking history (Private)
- `GET /api/bookings/:id` — Get single booking reference or ID (Private)
- `PUT /api/bookings/:id/cancel` — Cancel booking and release seats back to pool (Private)
- `GET /api/bookings` — List all bookings across the platform (Admin Only)

---

## 12. Installation Instructions

Clone the repository and install all dependencies:

```bash
# Clone the repository
git clone https://github.com/your-username/IMovies.git
cd IMovies

# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

Alternatively, from the project root directory:
```bash
npm run install:all
```

---

## 13. Environment Configuration

### Backend Environment Variables (`backend/.env`)

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/imovies
JWT_SECRET=imovies_super_secret_jwt_key_2026_cinema_secure
NODE_ENV=development
```

> **Note on MongoDB**: If you have a local MongoDB daemon running, it will automatically connect. If not, the backend will **seamlessly start a high-performance in-memory MongoDB instance** so you can run the project immediately with zero configuration!

---

## 14. How to Run Frontend

From the `frontend/` directory:

```bash
cd frontend
npm run dev
```

The frontend application will start on: **`http://localhost:3000`**

---

## 15. How to Run Backend & Seed Data

### Starting the Server
From the `backend/` directory:

```bash
cd backend
npm start
```

The backend server will start on: **`http://localhost:5000`**
*(Note: If the database is fresh/empty, it will automatically seed sample movies, theatres, and shows on first boot!)*

### Manually Re-Seeding the Database
To reset and re-populate the sample catalogue anytime:

```bash
cd backend
npm run seed
```

### Running Automated E2E & Concurrency Tests
To run the automated 11-step integration and race condition tests:

```bash
cd backend
node test-e2e.js
```

---

## 16. Sample Login Credentials

| Role | Email | Password | Quick Access |
|---|---|---|---|
| **Administrator** | `admin@imovies.com` | `Admin@123` | Full access to Admin Dashboard, Movie CRUD, Showtime creation, User audits |
| **Standard User** | `user@imovies.com` | `User@123` | Ticket booking, Seat selection, My Bookings, Ticket cancellation |
| **Standard User 2** | `priya@imovies.com` | `User@123` | Additional user for testing concurrent bookings |

> **Tip**: The login page includes **1-Click Demo Buttons** ("Demo Admin" and "Demo User") that autofill the credentials for instant testing!

---

## 17. Screenshots & Interface Overview

- **Homepage Hero Banner**: Vibrant cinematic backdrop carousel with certification, rating, overview, and trailer playback.
- **Movie Catalog & Filters**: Grid of Now Showing and Coming Soon movies with quick genre chips.
- **Movie Details & Calendar**: High-res backdrop, trailer modal, and responsive date ribbon for theatre schedules.
- **Seat Matrix**: Interactive cinema layout with Screen glow, VIP / Gold / Silver tiers, and dynamic pricing tally.
- **E-Ticket Confirmation**: Printable digital ticket modal with unique `IMOV-` reference code and barcode.
- **My Bookings**: Customer booking cards with active ticket status and instant cancellation.
- **Admin Dashboard**: Comprehensive management interface with platform revenue metrics, movie editor modal, show scheduler, and seat availability inspector.

---

## 18. Future Scope

1. **Payment Gateway Integration**: Direct Stripe / Razorpay / PayPal webhook payment settlement.
2. **Dynamic Theatre Floor Plans**: Custom polygon seat layout designer for varied screen geometries (balconies, sofa lounges).
3. **Food & Beverage Add-ons**: In-app concession stand ordering (popcorn, beverages) tied to ticket references.
4. **Push & WhatsApp Notifications**: Automated SMS/WhatsApp ticket confirmation with Apple Wallet pass integration.

---

## 19. Task Breakdown: Six Development Epics

| Epic # | Phase / Story Description | Status | Deliverable |
|---|---|---|---|
| **Epic 1** | **Project Architecture** | ✅ Completed | Clean client-server separation, REST standards, folder layout |
| **Epic 2** | **Project Setup & Configuration** | ✅ Completed | `package.json`, environment variables, CORS, Vite proxy, error handlers |
| **Epic 3** | **Backend Development** | ✅ Completed | Express REST APIs (Auth, Movies, Theatres, Shows, Bookings) |
| **Epic 4** | **Database Development** | ✅ Completed | Mongoose schemas, text index, atomic booking updates, `seed.js` |
| **Epic 5** | **Frontend Development** | ✅ Completed | React 19, Bootstrap 5, Dark cinema theme, SeatPicker, Admin Portal |
| **Epic 6** | **Project Execution & Testing** | ✅ Completed | End-to-end integration test suite, concurrency checks, comprehensive README |

---

*Crafted with precision for movie lovers everywhere.* 🍿🎥
#   I M o v i e s  
 