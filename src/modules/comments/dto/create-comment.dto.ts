import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty()
  readonly post: string;

  @ApiProperty()
  readonly text: string;
}
