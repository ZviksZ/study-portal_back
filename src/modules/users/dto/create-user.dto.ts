import { ApiProperty } from '@nestjs/swagger';
import { IsEmail }     from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly username: string;

  @ApiProperty()
  readonly password: string;

  @ApiProperty()
  readonly role: string;
}
