# Popcorn Palace - Movie Ticket Booking API

A fully functional backend API for managing movies, showtimes, and ticket bookings, developed with **NestJS** and **TypeORM**. This project is built to fulfill the backend requirements for a movie ticket booking system and emphasizes RESTful principles, input validation, error handling, testing,  and a clean modular structure.

---

## Features

### Movie Management
- Add, update, delete, and list movies.
- Fields: `title`, `genre`, `duration`, `rating`, `releaseYear`.

### Showtime Management
- Create, update, delete, and fetch showtimes by ID.
- Includes constraints to prevent overlapping showtimes for the same theater.
- Validates that referenced movie exists.
- Fields: `movie`, `theater`, `start_time`, `end_time`, `price`.

### Ticket Booking
- Book tickets with validation for duplicate seat bookings.
- View all booked tickets.
- Fields: `customer_name`, `seat_number`, `showtime_id`.

---

## Tech Stack
- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL (via Docker)
- **ORM:** TypeORM
- **Testing:** Jest + Supertest
- **Validation:** class-validator
- **Architecture:** Modular, testable, and scalable

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

- Tests service logic for movies, showtimes, and tickets.
- Includes:
  - Overlapping showtime validation
  - Seat conflict prevention
  - Movie existence verification in showtime logic

---

### 8. Run End-to-End (E2E) Tests

```bash
npm run test:e2e
```

- Located in `test/app.e2e-spec.ts`
- Tests full flow: movie creation → showtime creation → showtime overlap error
- Uses Supertest for HTTP-based testing


---

## API Endpoints Overview

### Movies
- `POST /movies` – Create
- `GET /movies` – List
- `PUT /movies/:id` – Update
- `DELETE /movies/:id` – Delete

### Showtimes
- `POST /showtimes` – Create (with movie existence check & overlap validation)
- `GET /showtimes` – List
- `GET /showtimes/:id` – Get by ID
- `PUT /showtimes/:id` – Update (with movie and overlap validation)
- `DELETE /showtimes/:id` – Delete

### Tickets
- `POST /tickets` – Book seat
- `GET /tickets` – List all


---

## Validation and Error Handling

- DTOs use `class-validator` decorators for strict validation.
- Global validation pipe strips unknown fields.
- Common error responses:
  - `400 Bad Request` – Validation failure
  - `404 Not Found` – Missing resource (e.g. movie, showtime)
  - `409 Conflict` – Seat taken or showtime overlap

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
├── main.ts
test/
└── app.e2e-spec.ts (End-to-End Tests)
```

---

## Author
**Salman Kablan**  
GitHub: [@Salman-Ka](https://github.com/Salman-Ka)

---

## License
This project is for educational and professional demonstration purposes only.
