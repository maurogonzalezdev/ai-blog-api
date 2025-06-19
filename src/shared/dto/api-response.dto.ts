import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({
    description: 'Was the request successful?',
    type: 'boolean',
    example: true,
  })
  success: boolean;

  @ApiProperty({ description: 'Status code', type: 'number', example: 200 })
  statusCode: number;

  @ApiProperty({
    description: 'Response message',
    type: 'string',
    example: 'Operation completed successfully',
  })
  message: string;

  @ApiProperty({
    description: 'ISO 8601 timestamp',
    type: 'string',
    example: '2025-06-19T21:19:18.689Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Generic data container',
    example: '{ user: { ...user } }',
  })
  data: T;

  @ApiProperty({
    description: 'JWT if required',
    required: false,
    type: 'string',
    example: 'jwtSample',
  })
  token?: string;
}
