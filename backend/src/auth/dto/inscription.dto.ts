import { IsEmail, IsNotEmpty, IsString, IsNumber, IsStrongPassword } from 'class-validator';

export class InscriptionUserDto {
  @IsString()
  @IsNotEmpty() 
  readonly prenom: string;

  @IsString()
  @IsNotEmpty() 
  readonly nom: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  motdepasse: string;
}
