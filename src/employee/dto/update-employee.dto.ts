import { IsString, IsInt, IsEmail, Min, IsOptional, ValidateNested, IsArray, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEmployeeDto {
  @ApiProperty({
    description: 'ID del empleado a actualizar',
    example: '60d21b4667d0d8992e610c85',
  })
  @IsMongoId()
  _id: string;

  @ApiPropertyOptional({
    description: 'Nombre del empleado',
    example: 'Juan',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Apellidos del empleado',
    example: 'Pérez García',
  })
  @IsOptional()
  @IsString()
  surnames?: string;

  @ApiPropertyOptional({
    description: 'Edad del empleado (mínimo 18 años)',
    example: 30,
    minimum: 18,
  })
  @IsOptional()
  @IsInt()
  @Min(18)
  age?: number;

  @ApiPropertyOptional({
    description: 'Ciudad donde reside el empleado',
    example: 'Barcelona',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico del empleado (único)',
    example: 'juan.perez@empresa.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Cargo o posición del empleado en la empresa',
    example: 'Desarrollador Lead',
  })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({
    description: 'Departamento al que pertenece el empleado',
    example: 'Innovación',
  })
  @IsOptional()
  @IsString()
  departament?: string;
}

export class UpdateEmployeesDto {
  @ApiProperty({
    description: 'Lista de empleados para actualización masiva',
    type: [UpdateEmployeeDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateEmployeeDto)
  employees: UpdateEmployeeDto[];
}
