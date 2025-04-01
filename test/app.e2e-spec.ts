import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import * as request from 'supertest';
import { DataSource } from 'typeorm'; // Used for direct DB access during tests

describe('End-to-End: Movie & Showtime Flow', () => {
  let app: INestApplication;
  let server: any;
  let dataSource: DataSource; // Will hold DB connection for cleanup

  // Runs once before all tests
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Use the same global validation pipe from main.ts
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

    await app.init();
    server = app.getHttpServer();

    // Get the TypeORM DataSource instance to manually clean the DB
    dataSource = app.get(DataSource);

    // Clean all relevant tables in reverse dependency order
    await dataSource.getRepository('ticket').delete({});    // Tickets depend on showtimes
    await dataSource.getRepository('showtime').delete({});  // Showtimes depend on movies
    await dataSource.getRepository('movie').delete({});     // Base entity
  });

  // Runs once after all tests
  afterAll(async () => {
    await app.close();
  });

  // Will hold the created movie ID for later tests
  let movieId: number;

  // Test: Create a movie
  it('POST /movies - create movie', async () => {
    const response = await request(server)
      .post('/movies')
      .send({
        title: 'The E2E Test Movie',
        genre: 'Action',
        duration: 120,
        rating: 8.5,
        releaseYear: 2025,
      })
      .expect(201); // Expect HTTP 201 Created

    // Save returned movie ID for future requests
    expect(response.body).toHaveProperty('id');
    movieId = response.body.id;
  });

  // Test: Create a showtime using the created movie
  it('POST /showtimes - create showtime for movie', async () => {
    const response = await request(server)
      .post('/showtimes')
      .send({
        theater: 'Cinema E2E',
        start_time: '2025-03-30T14:00:00Z',
        end_time: '2025-03-30T16:00:00Z',
        price: 50,
        movie: movieId,
      })
      .expect(201); // Expect HTTP 201 Created

    // Expect a proper showtime response with movie relation intact
    expect(response.body).toHaveProperty('id');
    expect(response.body.movie.id).toBe(movieId);
  });

  // Test: Attempt to create overlapping showtime (should fail)
  it('POST /showtimes - should fail due to overlapping', async () => {
    await request(server)
      .post('/showtimes')
      .send({
        theater: 'Cinema E2E',
        start_time: '2025-03-30T15:00:00Z', // Overlaps with previous
        end_time: '2025-03-30T17:00:00Z',
        price: 45,
        movie: movieId,
      })
      .expect(409); // Expect HTTP 409 Conflict due to overlap
  });
});
