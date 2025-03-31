import { Test, TestingModule } from '@nestjs/testing'; // Used to set up a NestJS testing environment
import { TicketsService } from './tickets.service';
import { getRepositoryToken } from '@nestjs/typeorm'; // Helps mock the repository
import { Ticket } from './ticket.entity';
import { Showtime } from '../showtimes/showtime.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('TicketsService', () => {
  let service: TicketsService;
  let ticketRepo: Repository<Ticket>;
  let showtimeRepo: Repository<Showtime>;

  // Mock data for a showtime object
  const mockShowtime = {
    id: 1,
    theater: 'Cinema 1',
    start_time: new Date('2025-03-30T16:00:00Z'),
    end_time: new Date('2025-03-30T18:00:00Z'),
    price: 40,
  } as Showtime;

  // Mock data for a ticket object
  const mockTicket = {
    id: 1,
    customer_name: 'Alice',
    seat_number: 'A1',
    showtime: mockShowtime,
  } as Ticket;

  // Mock implementation of the Ticket repository
  const mockTicketRepo = {
    findOne: jest.fn(), // Used to check if a seat is already taken
    create: jest.fn().mockImplementation((dto) => dto), // Mimics .create by returning the DTO as-is
    save: jest.fn().mockResolvedValue(mockTicket), // Mimics .save by returning a resolved mockTicket
  };

  // Mock implementation of the Showtime repository
  const mockShowtimeRepo = {
    findOne: jest.fn(), // Used to find a showtime by ID
  };

  // Prepare testing module and inject mocks before each test
  beforeEach(async () => {
    jest.clearAllMocks(); // Reset call history before every test

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: getRepositoryToken(Ticket),
          useValue: mockTicketRepo,
        },
        {
          provide: getRepositoryToken(Showtime),
          useValue: mockShowtimeRepo,
        },
      ],
    }).compile();

    // Get instances of service and repos from the testing module
    service = module.get<TicketsService>(TicketsService);
    ticketRepo = module.get<Repository<Ticket>>(getRepositoryToken(Ticket));
    showtimeRepo = module.get<Repository<Showtime>>(getRepositoryToken(Showtime));
  });

  // Test to verify the service is defined
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test creating a ticket successfully when the seat is available
  it('should create a ticket if seat is not already taken', async () => {
    (ticketRepo.findOne as jest.Mock).mockResolvedValue(null); // Simulate no seat conflict
    (showtimeRepo.findOne as jest.Mock).mockResolvedValue(mockShowtime); // Simulate existing showtime

    const dto = {
      customer_name: 'Alice',
      seat_number: 'A1',
      showtime_id: 1,
    };

    const result = await service.createTicket(dto);

    // Check that seat conflict check was performed
    expect(ticketRepo.findOne).toHaveBeenCalledWith({
      where: {
        seat_number: dto.seat_number,
        showtime: { id: dto.showtime_id },
      },
    });

    // Check that the ticket was created and saved
    expect(ticketRepo.create).toHaveBeenCalled();
    expect(ticketRepo.save).toHaveBeenCalled();

    // Ensure result is the expected ticket
    expect(result).toEqual(mockTicket);
  });

  // Test for booking a seat that is already taken
  it('should throw ConflictException if seat is already taken', async () => {
    (ticketRepo.findOne as jest.Mock).mockResolvedValue(mockTicket); // Simulate seat already taken

    const dto = {
      customer_name: 'Bob',
      seat_number: 'A1',
      showtime_id: 1,
    };

    // Expect error to be thrown and ticket not saved
    await expect(service.createTicket(dto)).rejects.toThrow(ConflictException);
    expect(ticketRepo.save).not.toHaveBeenCalled();
  });

  // Test for creating a ticket when showtime does not exist
  it('should throw NotFoundException if showtime is not found', async () => {
    (ticketRepo.findOne as jest.Mock).mockResolvedValue(null); // No seat conflict
    (showtimeRepo.findOne as jest.Mock).mockResolvedValue(null); // Simulate showtime not found

    const dto = {
      customer_name: 'Charlie',
      seat_number: 'B2',
      showtime_id: 999,
    };

    // Expect error to be thrown and ticket not saved
    await expect(service.createTicket(dto)).rejects.toThrow(NotFoundException);
    expect(ticketRepo.save).not.toHaveBeenCalled();
  });
});
