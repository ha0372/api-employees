import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto, CreateEmployeesDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto, UpdateEmployeesDto } from './dto/update-employee.dto';
import { DeleteEmployeeDto } from './dto/delete-employee.dto';
import { QueryEmployeeDto } from './dto/query-employee.dto';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiBody, 
  ApiQuery,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse
} from '@nestjs/swagger';

@ApiTags('employees')
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeesService: EmployeeService) {}

  /**
   * Crear un empleado
   */
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Crear un nuevo empleado', 
    description: 'Crea un empleado en la base de datos con los datos proporcionados.' 
  })
  @ApiBody({ type: CreateEmployeeDto })
  @ApiCreatedResponse({ 
    description: 'El empleado ha sido creado exitosamente.',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Empleado creado exitosamente' },
        data: {
          type: 'object',
          example: {
            insertedId: '60d21b4667d0d8992e610c85',
            acknowledged: true
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Datos inválidos proporcionados.' })
  async createOne(@Body() createEmployeeDto: CreateEmployeeDto) {
    const result = await this.employeesService.create(createEmployeeDto);
    return {
      success: true,
      message: 'Empleado creado exitosamente',
      data: result
    };
  }

  /**
   * Crear múltiples empleados
   */
  @Post('create-bulk')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Crear múltiples empleados', 
    description: 'Permite la creación masiva de múltiples empleados en una sola operación.' 
  })
  @ApiBody({ type: CreateEmployeesDto })
  @ApiCreatedResponse({ 
    description: 'Los empleados han sido creados exitosamente.',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: '5 empleados creados exitosamente' },
        data: {
          type: 'object',
          example: {
            insertedIds: {
              '0': '60d21b4667d0d8992e610c85',
              '1': '60d21b4667d0d8992e610c86'
            },
            acknowledged: true
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Datos inválidos proporcionados.' })
  async createMany(@Body() createEmployeesDto: CreateEmployeesDto) {
    const result = await this.employeesService.create(createEmployeesDto.employees);
    
    let message = 'Empleados creados exitosamente';
    
    if ('insertedIds' in result) {
      const count = Object.keys(result.insertedIds).length;
      message = `${count} empleados creados exitosamente`;
    }
    
    return {
      success: true,
      message,
      data: result
    };
  }

  /**
   * Actualizar un empleado
   */
  @Put('update-by-id')
  @ApiOperation({ 
    summary: 'Actualizar un empleado', 
    description: 'Actualiza los datos de un empleado existente basado en su ID.' 
  })
  @ApiBody({ type: UpdateEmployeeDto })
  @ApiOkResponse({ 
    description: 'El empleado ha sido actualizado exitosamente.',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Empleado actualizado exitosamente' },
        data: {
          type: 'object',
          example: {
            matchedCount: 1,
            modifiedCount: 1,
            acknowledged: true
          }
        }
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Empleado no encontrado.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos proporcionados.' })
  async updateOne(@Body() updateEmployeeDto: UpdateEmployeeDto) {
    const result = await this.employeesService.update(updateEmployeeDto);
    return {
      success: true,
      message: 'Empleado actualizado exitosamente',
      data: result
    };
  }

  /**
   * Actualizar múltiples empleados
   */
  @Put('update-bulk')
  @ApiOperation({ 
    summary: 'Actualizar múltiples empleados', 
    description: 'Permite la actualización masiva de múltiples empleados en una sola operación.' 
  })
  @ApiBody({ type: UpdateEmployeesDto })
  @ApiOkResponse({ 
    description: 'Los empleados han sido actualizados exitosamente.',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: '5 empleados actualizados exitosamente' },
        data: {
          type: 'object',
          example: {
            matchedCount: 5,
            modifiedCount: 5,
            acknowledged: true
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Datos inválidos proporcionados.' })
  async updateMany(@Body() updateEmployeesDto: UpdateEmployeesDto) {
    const result = await this.employeesService.update(updateEmployeesDto.employees);
    
    const count = result.modifiedCount || 0;
    
    return {
      success: true,
      message: `${count} empleados actualizados exitosamente`,
      data: result
    };
  }

  /**
   * Eliminar lógicamente uno o varios empleados
   */
  @Delete('delete')
  @ApiOperation({ 
    summary: 'Eliminar empleados lógicamente', 
    description: 'Realiza una eliminación lógica de los empleados (cambia isDelete a true).' 
  })
  @ApiBody({ type: DeleteEmployeeDto })
  @ApiOkResponse({ 
    description: 'Los empleados han sido eliminados lógicamente.',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: '3 empleado(s) eliminado(s) lógicamente' },
        data: {
          type: 'object',
          example: {
            deletedCount: 3,
            message: '3 empleado(s) eliminado(s) lógicamente'
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Datos inválidos proporcionados.' })
  async delete(@Body() deleteEmployeeDto: DeleteEmployeeDto) {
    const result = await this.employeesService.delete(deleteEmployeeDto.ids);
    return {
      success: true,
      message: `${result.deletedCount} empleado(s) eliminado(s) lógicamente`,
      data: result
    };
  }

  /**
   * Obtener un empleado por su ID
   */
  @Get('get-by-id/:id')
  @ApiOperation({ 
    summary: 'Obtener empleado por ID', 
    description: 'Recupera la información detallada de un empleado específico por su ID.' 
  })
  @ApiParam({ name: 'id', description: 'ID del empleado a buscar', example: '60d21b4667d0d8992e610c85' })
  @ApiOkResponse({ 
    description: 'El empleado ha sido encontrado.',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          example: {
            _id: '60d21b4667d0d8992e610c85',
            name: 'Juan',
            surnames: 'Pérez García',
            age: 30,
            city: 'Madrid',
            email: 'juan.perez@empresa.com',
            position: 'Desarrollador Senior',
            departament: 'Tecnología',
            createAt: '2023-06-15T10:30:00.000Z',
            updateAt: '2023-06-15T10:30:00.000Z',
            isDelete: false
          }
        }
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Empleado no encontrado.' })
  async findOne(@Param('id') id: string) {
    const employee = await this.employeesService.findById(id);
    return {
      success: true,
      data: employee
    };
  }

  /**
   * Listar todos los empleados (con filtros opcionales)
   */
  @Get('get-all')
  @ApiOperation({ 
    summary: 'Listar todos los empleados', 
    description: 'Recupera una lista paginada de todos los empleados con opción de filtrado y ordenamiento.' 
  })
  @ApiOkResponse({ 
    description: 'Lista de empleados recuperada exitosamente.',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: {
            type: 'object',
            example: {
              _id: '60d21b4667d0d8992e610c85',
              name: 'Juan',
              surnames: 'Pérez García',
              age: 30,
              city: 'Madrid',
              email: 'juan.perez@empresa.com',
              position: 'Desarrollador Senior',
              departament: 'Tecnología',
              createAt: '2023-06-15T10:30:00.000Z',
              updateAt: '2023-06-15T10:30:00.000Z',
              isDelete: false
            }
          }
        },
        pagination: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 50 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            pages: { type: 'number', example: 5 }
          }
        }
      }
    }
  })
  async findAll(@Query() query: QueryEmployeeDto) {
    const result = await this.employeesService.findAll(query);
    return {
      success: true,
      data: result.data,
      pagination: result.pagination
    };
  }

  /**
   * Buscar empleados por departamento
   */
  @Get('departament/:departament')
  @ApiOperation({ 
    summary: 'Buscar empleados por departamento', 
    description: 'Filtra empleados que pertenecen a un departamento específico.' 
  })
  @ApiParam({ name: 'departament', description: 'Nombre del departamento', example: 'Tecnología' })
  @ApiOkResponse({ 
    description: 'Lista de empleados por departamento recuperada exitosamente.',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: {
            type: 'object',
            example: {
              _id: '60d21b4667d0d8992e610c85',
              name: 'Juan',
              surnames: 'Pérez García',
              age: 30,
              city: 'Madrid',
              email: 'juan.perez@empresa.com',
              position: 'Desarrollador Senior',
              departament: 'Tecnología',
              createAt: '2023-06-15T10:30:00.000Z',
              updateAt: '2023-06-15T10:30:00.000Z',
              isDelete: false
            }
          }
        },
        pagination: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 15 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            pages: { type: 'number', example: 2 }
          }
        }
      }
    }
  })
  async findByDepartament(
    @Param('departament') departament: string,
    @Query() query: QueryEmployeeDto
  ) {
    const result = await this.employeesService.findByDepartament(departament, query);
    return {
      success: true,
      data: result.data,
      pagination: result.pagination
    };
  }

  /**
   * Buscar empleados por posición/cargo
   */
  @Get('position/:position')
  @ApiOperation({ 
    summary: 'Buscar empleados por posición/cargo', 
    description: 'Filtra empleados por su cargo o posición en la empresa.' 
  })
  @ApiParam({ name: 'position', description: 'Cargo o posición', example: 'Desarrollador Senior' })
  @ApiOkResponse({ 
    description: 'Lista de empleados por posición recuperada exitosamente.',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: {
            type: 'object'
          }
        },
        pagination: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            pages: { type: 'number' }
          }
        }
      }
    }
  })
  async findByPosition(
    @Param('position') position: string,
    @Query() query: QueryEmployeeDto
  ) {
    const result = await this.employeesService.findByPosition(position, query);
    return {
      success: true,
      data: result.data,
      pagination: result.pagination
    };
  }

  /**
   * Búsqueda avanzada con múltiples criterios
   */
  @Get('search/advanced')
  @ApiOperation({ 
    summary: 'Búsqueda avanzada de empleados', 
    description: 'Realiza búsquedas complejas combinando múltiples criterios como nombre, edad, ciudad, etc.' 
  })
  @ApiOkResponse({ 
    description: 'Resultados de búsqueda avanzada recuperados exitosamente.'
  })
  async advancedSearch(@Query() query: QueryEmployeeDto) {
    const result = await this.employeesService.advancedSearch(query);
    return {
      success: true,
      data: result.data,
      pagination: result.pagination
    };
  }
}
