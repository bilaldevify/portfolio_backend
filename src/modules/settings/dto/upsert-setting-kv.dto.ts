import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpsertSettingKvDto {
  @IsString()
  @MaxLength(100)
  key: string;

  @IsOptional()
  @IsString()
  value?: string;
}
