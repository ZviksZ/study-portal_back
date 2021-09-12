import { ApiProperty }      from '@nestjs/swagger';
import { API_DESCRIPTIONS } from '../const/descriptions';

export class MongoSchemaCommon {
  @ApiProperty({
    example: '60b78382f79d443de8d2f172',
    description: API_DESCRIPTIONS.ID,
  })
  _id: string;

  @ApiProperty({
    example: '2021-06-11T05:18:41.535Z',
    description: API_DESCRIPTIONS.CREATE_DATE,
  })
  createdAt: Date

  @ApiProperty({
    example: '2021-06-11T05:18:41.535Z',
    description: API_DESCRIPTIONS.UPDATE_DATE,
  })
  updatedAt: Date
}
