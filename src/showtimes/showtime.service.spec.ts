import { Test, TestingModule } from '@nestjs/testing'; // For creating test modules
import { ShowtimeService } from './showtime.service';
import { getRepositoryToken } from '@nestjs/typeorm'; // For mocking TypeORM repo
import { Showtime } from './showtime.entity';
import { Repository } from 'typeorm';
import { Movie } from '../movies/movie.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ShowtimeService', () => {
  let service: ShowtimeService;
  let repo: Repository<Showtime>;
  let movieRepo: Repository<Movie>;

  // A mock showtime object we’ll reuse in tests
  const mockShowtime: Showtime = {
    id: 1,
    theater: 'Cinema 1',
    start_time: new Date('2025-03-30T14:00:00Z'),
    end_time: new Date('2025-03-30T16:00:00Z'),
    price: 40,
    movie: { id: 1 } as Movie,
    tickets: []
  };

  // Mock the repository functions for Showtime
  const mockRepo = {
    create: jest.fn().mockImplementation((dto) => dto), // returns DTO as-is
    save: jest.fn().mockResolvedValue(mockShowtime),    // resolves to mock showtime
    findOne: jest.fn(),        // for overlap checks and lookups
    findOneBy: jest.fn(),      // for getById / delete
    update: jest.fn(),         // for update() logic
    delete: jest.fn(),         // for delete() test
  };

  // Mock the repository function for Movie existence check
  const mockMovieRepo = {
    findOneBy: jest.fn(), // used to simulate finding a movie by ID
  };

  // Setup the testing module before each test
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowtimeService,
        {
          provide: getRepositoryToken(Showtime),
          useValue: mockRepo,
        },
        {
          provide: getRepositoryToken(Movie),
          useValue: mockMovieRepo,
        },
      ],
    }).compile();

    // Extract service and repo instances from the test module
    service = module.get<ShowtimeService>(ShowtimeService);
    repo = module.get<Repository<Showtime>>(getRepositoryToken(Showtime));
    movieRepo = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  // First test: Make sure the service is defined
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test: create() should succeed when movie exists and no overlap
  it('should create a showtime when there is no overlap and movie exists', async () => {
    const dto = {
      theater: 'Cinema 1',
      start_time: '2025-03-30T14:00:00Z',
      end_time: '2025-03-30T16:00:00Z',
      price: 40,
      movie: 1,
    };

    // Simulate movie found and no overlapping showtime
    mockMovieRepo.findOneBy.mockResolvedValue({ id: 1 });
    repo.findOne = jest.fn().mockResolvedValue(null);

    const result = await service.create(dto);

    // Ensure the service returns the mocked showtime
    expect(result).toEqual(mockShowtime);
    // Ensure movie lookup was called
    expect(mockMovieRepo.findOneBy).toHaveBeenCalledWith({ id: dto.movie });
    // Ensure overlap check was made
    expect(repo.findOne).toHaveBeenCalled();
    // Ensure showtime was created and saved
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  // Test: create() should fail if movie does not exist
  it('should throw NotFoundException if movie does not exist when creating', async () => {
    const dto = {
      theater: 'Cinema 1',
      start_time: '2025-03-30T14:00:00Z',
      end_time: '2025-03-30T16:00:00Z',
      price: 40,
      movie: 999,
    };

    // Simulate movie not found
    mockMovieRepo.findOneBy.mockResolvedValue(null);

    await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    expect(repo.create).not.toHaveBeenCalled();
    expect(repo.save).not.toHaveBeenCalled();
  });

  // Test: update() should throw NotFoundException if new movie does not exist
  it('should throw NotFoundException if updated movie does not exist', async () => {
    const updateData = {
      movie: { id: 999 } as Movie,
    };

    // Simulate existing showtime
    mockRepo.findOneBy.mockResolvedValue(mockShowtime);
    // Simulate movie not found
    mockMovieRepo.findOneBy.mockResolvedValue(null);

    await expect(service.update(1, updateData)).rejects.toThrow(NotFoundException);
    expect(mockRepo.update).not.toHaveBeenCalled();
  });
});
