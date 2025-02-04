import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', 
      host: 'localhost', 
      port: 5432, 
      username: 'admin', 
      password: 'admin', 
      database: 'moviebooking',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], 
      synchronize: true,
      logging: true,
    }),
    UsersModule,
    AuthModule,
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