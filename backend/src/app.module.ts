import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';
import {config } from 'dotenv'
import { ReservationsModule } from './reservations/reservations.module';
import { User } from './users/entities/user.entity';
import { Reservation } from './reservations/entities/reservations.entity';
import { ReservationUser } from './reservations/entities/reservations_users.entity';

config();
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', 
      host: process.env.DB_HOST || 'localhost', 
      port: parseInt(process.env.DB_PORT || '5432'), 
      username: process.env.DB_USERNAME || 'admin', 
      password: process.env.DB_PASSWORD || 'admin', 
      database: process.env.DB_NAME || 'moviebooking',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], 
      synchronize: true,
      logging: true,
    }),
    UsersModule,
    AuthModule,
    MoviesModule,
    ReservationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {
    if (connection.isConnected) {
      console.log('Database connection successful!');
    } else {
      console.error('Database connection failed!');
    }
  }
}