import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty({required: false})
  readonly title?: string;

  @ApiProperty({required: false})
  readonly body?: string;
}
