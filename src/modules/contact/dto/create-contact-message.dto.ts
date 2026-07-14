import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateContactMessageDto {
  @IsString()
  @MaxLength(150)
  name: string;

  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  subject?: string;

  @IsString()
  @MaxLength(5000)
  message: string;
}
