import { IsArray, IsMongoId, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteEmployeeDto {
  @ApiProperty({
    description: 'Lista de IDs de empleados a eliminar lógicamente',
    example: ['60d21b4667d0d8992e610c85', '60d21b4667d0d8992e610c86'],
    type: [String],
  })
  @IsArray()
  @IsMongoId({ each: true })
  ids: string[];
}