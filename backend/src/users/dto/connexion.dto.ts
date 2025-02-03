import { IsEmail, IsNotEmpty, IsString, IsNumber, IsStrongPassword, isString } from 'class-validator';

export class ConnexionUserDto {
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;
  
    @IsString()
    @IsNotEmpty()
    motdepasse: string;
  }
