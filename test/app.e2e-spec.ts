import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('End-to-End: Movie & Showtime Flow', () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply global validation pipe (just like in main.ts)
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  let movieId: number;

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
      .expect(201);

    expect(response.body).toHaveProperty('id');
    movieId = response.body.id;
  });

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
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.movie.id).toBe(movieId);
  });

  it('POST /showtimes - should fail due to overlapping', async () => {
    await request(server)
      .post('/showtimes')
      .send({
        theater: 'Cinema E2E',
        start_time: '2025-03-30T15:00:00Z',
        end_time: '2025-03-30T17:00:00Z',
        price: 45,
        movie: movieId,
      })
      .expect(409); // Conflict
  });
});
