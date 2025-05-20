import { IsOptional, IsString, IsInt, Min, Max, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryEmployeeDto {
  @ApiPropertyOptional({
    description: 'Filtrar por nombre del empleado (búsqueda parcial)',
    example: 'Juan',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por apellidos del empleado (búsqueda parcial)',
    example: 'Pérez',
  })
  @IsOptional()
  @IsString()
  surnames?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por ciudad del empleado',
    example: 'Madrid',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por cargo/posición del empleado',
    example: 'Desarrollador',
  })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por departamento del empleado',
    example: 'Tecnología',
  })
  @IsOptional()
  @IsString()
  departament?: string;

  @ApiPropertyOptional({
    description: 'Número de página para la paginación (inicia en 1)',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Cantidad de registros por página (máximo 100)',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Campo por el cual ordenar los resultados',
    example: 'name',
    enum: ['name', 'surnames', 'age', 'city', 'position', 'departament', 'createAt', 'updateAt'],
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Dirección del ordenamiento',
    example: 'asc',
    default: 'asc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc';
  
  @ApiPropertyOptional({
    description: 'Edad mínima para filtrar empleados',
    example: 25,
    minimum: 18,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(18)
  minAge?: number;
  
  @ApiPropertyOptional({
    description: 'Edad máxima para filtrar empleados',
    example: 50,
    minimum: 18,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(18)
  maxAge?: number;
}