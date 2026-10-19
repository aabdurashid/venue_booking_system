# Venue Booking System

A full-stack web application for discovering and booking wedding venues in Tashkent, Uzbekistan.

## Features

- **Admin Panel:** Manage venues, venue owners, approvals, and all bookings.
- **Venue Owner Panel:** Register venues, update venue information, and manage reservations.
- **User Panel:** Browse approved venues, search and filter listings, and book available dates.
- **Booking Calendar:** View available, booked, and past dates.
- **Search and Filtering:** Search venues by name and filter by district, price, capacity, and approval status.
- **Booking Management:** View booking details, guest counts, customer information, and booking statuses.
- **Authentication and Authorization:** JWT authentication and role-based access control (RBAC).
- **Password Security:** Store passwords as secure hashes.

## Tech Stack

- React
- Node.js
- Express.js
- PostgreSQL
- JSON Web Tokens (JWT)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/aabdurashid/venue_booking_system.git
cd venue_booking_system
```

### 2. Install dependencies

Install dependencies in both the frontend and backend directories:

```bash
cd frontend
npm install
```

```bash
cd ../backend
npm install
```

### 3. Configure environment variables

Create a `.env` file in the backend directory and configure the required database connection and JWT secret.

### 4. Start the application

Run the backend and frontend using their respective development scripts:

```bash
npm run dev
```

Run each command in the appropriate project directory and use separate terminals.
