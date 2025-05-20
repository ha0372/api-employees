import { IsString, IsInt, IsEmail, Min, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({
    description: 'Nombre del empleado',
    example: 'Juan',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Apellidos del empleado',
    example: 'Pérez García',
  })
  @IsString()
  surnames: string;

  @ApiProperty({
    description: 'Edad del empleado (mínimo 18 años)',
    example: 30,
    minimum: 18,
  })
  @IsInt()
  @Min(18)
  age: number;

  @ApiProperty({
    description: 'Ciudad donde reside el empleado',
    example: 'Madrid',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Correo electrónico del empleado (único)',
    example: 'juan.perez@empresa.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Cargo o posición del empleado en la empresa',
    example: 'Desarrollador Senior',
  })
  @IsString()
  position: string;

  @ApiProperty({
    description: 'Departamento al que pertenece el empleado',
    example: 'Tecnología',
  })
  @IsString()
  departament: string;
}

export class CreateEmployeesDto {
  @ApiProperty({
    description: 'Lista de empleados para creación masiva',
    type: [CreateEmployeeDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEmployeeDto)
  employees: CreateEmployeeDto[];
}
