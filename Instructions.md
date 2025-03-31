# Popcorn Palace - Movie Ticket Booking API

A fully functional backend API for managing movies, showtimes, and ticket bookings, developed with **NestJS** and **TypeORM**. This project is built to fulfill the backend requirements for a movie ticket booking system and emphasizes RESTful principles, input validation, error handling, and a clean modular structure.

---

## Features

### Movie Management
- Add, update, delete, and list movies.
- Fields: `title`, `genre`, `duration`, `rating`, `releaseYear`.

### Showtime Management
- Create, update, delete, and fetch showtimes by ID.
- Includes constraints to prevent overlapping showtimes for the same theater.
- Fields: `movie`, `theater`, `start_time`, `end_time`, `price`.

### Ticket Booking
- Book tickets with validation for duplicate seat bookings.
- View all booked tickets.
- Fields: `customer_name`, `seat_number`, `showtime_id`.

---

## Tech Stack
- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Testing:** Jest
- **Validation:** class-validator

---

## Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16 or later)
- [Docker](https://www.docker.com/) & Docker Compose
- Git

### 2. Clone the Repository
```bash
git clone https://github.com/Salman-Ka/popcorn-palace-backend.git
cd popcorn-palace-backend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the PostgreSQL Database
Make sure Docker is running. Then start the database:
```bash
docker compose up -d
```
This will spin up a local PostgreSQL instance on port `5432`.

### 5. Environment Configuration
Ensure your `TypeOrmModule` config or `.env` file contains the following:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=popcorn_palace
```
> If using `TypeOrmModule.forRoot()` directly in code, match the same settings.

### 6. Start the Server
```bash
npm run start:dev
```
The server will be accessible at: **http://localhost:3000**

### 7. Run Unit Tests
```bash
npm run test
```
- This will run all unit tests using Jest.
- Includes service tests for movies, showtimes (with overlap validation), and tickets (with seat duplication logic).

---

## API Endpoints Overview

### Movies
- `POST /movies`
- `GET /movies`
- `PUT /movies/:id`
- `DELETE /movies/:id`

### Showtimes
- `POST /showtimes`
- `GET /showtimes`
- `GET /showtimes/:id`
- `PUT /showtimes/:id`
- `DELETE /showtimes/:id`

### Tickets
- `POST /tickets`
- `GET /tickets`

---

## Validation and Error Handling
- Input validation using DTOs and decorators (`@IsNotEmpty`, `@IsNumber`, etc).
- Returns standardized error responses:
  - 400 Bad Request → Invalid input data
  - 404 Not Found → Resource missing
  - 409 Conflict → Seat already booked or showtime conflict

---

## Folder Structure
```
src/
├── movies/
│   ├── movie.entity.ts
│   ├── movie.service.ts
│   ├── movie.controller.ts
│   ├── movie.module.ts
│   ├── movies.service.spec.ts
│   ├── dto/
├── showtimes/
│   ├── showtime.entity.ts
│   ├── showtime.service.ts
│   ├── showtime.controller.ts
│   ├── showtime.module.ts
│   ├── showtime.service.spec.ts
│   ├── dto/
├── tickets/
│   ├── ticket.entity.ts
│   ├── tickets.service.ts
│   ├── tickets.controller.ts
│   ├── tickets.module.ts
│   ├── ticket.service.spec.ts
│   ├── dto/
├── app.module.ts
└── main.ts
```

---

## Author
**Salman Kablan**  
GitHub: [@Salman-Ka](https://github.com/Salman-Ka)

---

## License
This project is for educational and professional demonstration purposes only.
