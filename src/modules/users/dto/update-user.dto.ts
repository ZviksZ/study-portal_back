import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({required: false})
  readonly email?: string;

  @ApiProperty({required: false})
  readonly username?: string;

  @ApiProperty({required: false})
  readonly role?: string;
}
