import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ConnexionUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    motdepasse: string;
  }
