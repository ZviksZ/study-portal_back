import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({description: 'Email или username'})
  readonly login: string;

  @ApiProperty()
  readonly password: string;
}
