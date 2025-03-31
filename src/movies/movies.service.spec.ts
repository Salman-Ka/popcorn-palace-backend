import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';


describe('MoviesService', () => {
  let service: MovieService;
  let repo: Repository<Movie>;

  // Fake movie object returned by the save() mock
  const mockMovie: Movie = {
    id: 1,
    title: 'Inception',
    genre: 'Sci-Fi',
    duration: 148,
    rating: 8.8,
    releaseYear: 2010,
  };

  // Fake repository methods — mocking .create() and .save()
  const mockRepo = {
    create: jest.fn().mockImplementation((dto) => dto), // returns what you give it
    save: jest.fn().mockResolvedValue(mockMovie),       // resolves to mockMovie
    findOneBy: jest.fn(),                 // Mocks the repository method that finds a movie by ID (used in update/delete)
    update: jest.fn(),                   // Mocks the repository method that updates a movie (used in update test)

  };

  // Setup test environment with Nest's TestingModule
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          // Inject mocked version of Movie repository
          provide: getRepositoryToken(Movie),
          useValue: mockRepo,
        },
      ],
    }).compile();

    // Get instances from the compiled module
    service = module.get<MovieService>(MovieService);
    repo = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  // Basic test to confirm service exists
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test for creating a movie
  it('should create a movie', async () => {
    const dto = {
      title: 'Inception',
      genre: 'Sci-Fi',
      duration: 148,
      rating: 8.8,
      releaseYear: 2010,
    };

    // Call the real service function (with mocked dependencies)
    const result = await service.create(dto);

    // Confirm the return value is the mock
    expect(result).toEqual(mockMovie);

    // Confirm that repo.create() and repo.save() were called correctly
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalledWith(dto);
  });

    // Test for updating an existing movie
    it('should update a movie if it exists', async () => {
        const updatedData = { title: 'Inception Updated' };
    
        mockRepo.findOneBy.mockResolvedValue(mockMovie);
        mockRepo.update.mockResolvedValue(undefined); // typeorm update returns void
    
        const result = await service.update(1, updatedData);
    
        expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
        expect(mockRepo.update).toHaveBeenCalledWith(1, updatedData);
        expect(result).toEqual(mockMovie);
      });
    
      // Test for update failure when movie doesn't exist
      it('should throw NotFoundException if movie does not exist', async () => {
        mockRepo.findOneBy.mockResolvedValue(null); // simulate not found
    
        await expect(service.update(99, { title: 'Invalid' }))
          .rejects
          .toThrowError(new NotFoundException('Movie with id 99 not found'));
      });
    

  
});
