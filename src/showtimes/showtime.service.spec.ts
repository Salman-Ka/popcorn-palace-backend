import { Test, TestingModule } from '@nestjs/testing'; // For creating test modules
import { ShowtimeService } from './showtime.service';
import { getRepositoryToken } from '@nestjs/typeorm'; // For mocking TypeORM repo
import { Showtime } from './showtime.entity';
import { Repository } from 'typeorm';
import { Movie } from 'src/movies/movie.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ShowtimeService', () => {
  let service: ShowtimeService;
  let repo: Repository<Showtime>;

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

  // Mock the repository functions
  const mockRepo = {
    create: jest.fn().mockImplementation((dto) => dto), // returns DTO as-is
    save: jest.fn().mockResolvedValue(mockShowtime),    // resolves to mock showtime
    findOne: jest.fn(),        // for overlap checks and lookups
    findOneBy: jest.fn(),      // for getById / delete
    update: jest.fn(),         // for update() logic
    delete: jest.fn(),         // for delete() test
  };

  // Setup the testing module before each test
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowtimeService,
        {
          // Provide the mocked repo instead of the real DB
          provide: getRepositoryToken(Showtime),
          useValue: mockRepo,
        },
      ],
    }).compile();

    // Extract service and repo instances from the test module
    service = module.get<ShowtimeService>(ShowtimeService);
    repo = module.get<Repository<Showtime>>(getRepositoryToken(Showtime));
  });

  // First test: Make sure the service is defined
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

    // Test: create() should succeed when there is no overlap
    it('should create a showtime when there is no overlap', async () => {
        const dto = {
          theater: 'Cinema 1',
          start_time: '2025-03-30T14:00:00Z',
          end_time: '2025-03-30T16:00:00Z',
          price: 40,
          movie: 1, // movie ID
        };
    
        // Mock findOne to simulate no overlap (returns null)
        repo.findOne = jest.fn().mockResolvedValue(null);
    
        // Call the create() method
        const result = await service.create(dto);
    
        // Check the result is the mock showtime object
        expect(result).toEqual(mockShowtime);
    
        // Verify that repo.findOne was called to check overlap
        expect(repo.findOne).toHaveBeenCalled();
    
        // Verify that repo.create and repo.save were called
        expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({
          theater: dto.theater,
          price: dto.price,
        }));
        expect(repo.save).toHaveBeenCalled();
      });


        // Test: create() should throw ConflictException on overlapping showtime
  it('should throw ConflictException if showtime overlaps in the same theater', async () => {
    const dto = {
      theater: 'Cinema 1',
      start_time: '2025-03-30T15:00:00Z', // Overlaps with existing 14:00–16:00
      end_time: '2025-03-30T17:00:00Z',
      price: 40,
      movie: 1,
    };

    // Mock overlap detection: simulate a found conflicting showtime
    repo.findOne = jest.fn().mockResolvedValue(mockShowtime);

    // Service should reject with ConflictException
    await expect(service.create(dto)).rejects.toThrow(ConflictException);

    // Ensure overlap check was made
    expect(repo.findOne).toHaveBeenCalled();
    // Ensure showtime is NOT created when overlapping
    expect(repo.create).not.toHaveBeenCalled();
    // Ensure showtime is NOT saved when overlapping
    expect(repo.save).not.toHaveBeenCalled();
  });



    // Test: update() should succeed when no overlap and showtime exists
    it('should update a showtime if it exists and no overlap', async () => {
        const updatedData = {
          theater: 'Cinema 1',
          start_time: new Date( '2025-03-30T17:00:00Z'),
          end_time: new Date('2025-03-30T19:00:00Z'),
          price: 50,
          movie: { id: 2 } as Movie,
        };
    
        // Simulate existing showtime found by ID
        mockRepo.findOneBy.mockResolvedValue(mockShowtime);
    
        // Simulate no overlap found
        mockRepo.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce({
          ...mockShowtime,
          ...updatedData,
          movie: { id: 2 } as Movie,
        });
    
        const result = await service.update(1, updatedData);
    
        expect(mockRepo.update).toHaveBeenCalledWith(1, expect.objectContaining({
          theater: updatedData.theater,
          start_time: new Date(updatedData.start_time),
          end_time: new Date(updatedData.end_time),
        }));
    
        expect(result).toEqual(expect.objectContaining({
          theater: updatedData.theater,
          price: updatedData.price,
          movie: { id: 2 },
        }));
      });
    
      // Test: update() should throw ConflictException on overlapping update
      it('should throw ConflictException if updated showtime overlaps', async () => {
        const updatedData = {
          start_time: new Date('2025-03-30T15:00:00Z'),
          end_time: new Date('2025-03-30T17:00:00Z'),
        };
    
        mockRepo.findOneBy.mockResolvedValue(mockShowtime);
        mockRepo.findOne.mockResolvedValue({ ...mockShowtime, id: 99 }); // overlapping showtime
    
        await expect(service.update(1, updatedData)).rejects.toThrow(ConflictException);
        expect(mockRepo.update).not.toHaveBeenCalled();
      });
    
      // Test: update() should throw NotFoundException if showtime is missing
      it('should throw NotFoundException if showtime does not exist', async () => {
        mockRepo.findOneBy.mockResolvedValue(null);
    
        await expect(service.update(999, { theater: 'New Theater' }))
          .rejects
          .toThrow(new NotFoundException('Showtime with id 999 not found'));
      });
    

    
});
