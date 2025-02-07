import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { Movie } from './entities/movie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
  imports: [TypeOrmModule.forFeature([Movie])],
  
})
export class MoviesModule {}
