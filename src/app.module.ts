import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './movies/movie.entity';
import { MovieModule } from './movies/movie.module';
import { Showtime } from './showtimes/showtime.entity';
import { ShowtimeModule } from './showtimes/showtime.module';
import { Ticket } from './tickets/ticket.entity';
import { TicketsModule } from './tickets/tickets.module';

// This is the root application module
@Module({
  imports: [
    // Configure database connection using PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'popcorn-palace',
      password: 'popcorn-palace',
      database: 'popcorn-palace',
      entities: [Movie, Showtime, Ticket], // Entities to auto-load
      synchronize: true, // Auto-create DB schema (disable in production)
    }),

    // Import domain modules (feature modules)
    MovieModule,
    ShowtimeModule,
    TicketsModule,

    // Removed App-level controller/service & extra repo bindings (not needed)
    // TypeOrmModule.forFeature([Movie]),
  ],

  // App-level controllers and providers (commented out, unused)
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
