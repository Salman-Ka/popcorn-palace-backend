import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './movies/movie.entity';
import { MovieModule } from './movies/movie.module';
import { Showtime } from './showtimes/showtime.entity';
import { ShowtimeModule } from './showtimes/showtime.module';
import { Ticket } from './tickets/ticket.entity';

//import { AppController } from './app.controller';
//import { AppService } from './app.service';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'popcorn-palace',
      password: 'popcorn-palace',
      database: 'popcorn-palace',
      entities: [Movie, Showtime, Ticket],
      synchronize: true, // Auto-creates tables based on entities
    }),
    MovieModule,
    ShowtimeModule,
    TicketsModule,
    //TypeOrmModule.forFeature([Movie]), // Makes Movie repository available
  ],

  //controllers: [AppController],
  //providers: [AppService],

})
  
export class AppModule {}
