import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { MongodbService } from '../database/mongodb.service';
import { ObjectId } from 'mongodb';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './interfaces/employee.interface';
import { QueryEmployeeDto } from './dto/query-employee.dto';

@Injectable()
export class EmployeeService {
  private readonly logger = new Logger('EmployeesService');
  private readonly COLLECTION_NAME = 'employees';

  constructor(private readonly mongodbService: MongodbService) {}

  /**
   * Crear uno o múltiples empleados
   */
  async create(employeeData: CreateEmployeeDto | CreateEmployeeDto[]) {
    try {
      const collection = this.mongodbService.getCollection<Employee>(this.COLLECTION_NAME);
      const now = new Date();
      
      // Verificar si es un solo empleado o varios
      if (Array.isArray(employeeData)) {
        // Preparar múltiples empleados para inserción
        const employees = employeeData.map(employee => ({
          ...employee,
          createAt: now,
          updateAt: now,
          isDelete: false
        }));
        
        // Inserción masiva (bulk)
        return await collection.insertMany(employees);
      } else {
        // Insertar un solo empleado
        const employee = {
          ...employeeData,
          createAt: now,
          updateAt: now,
          isDelete: false
        };
        
        return await collection.insertOne(employee);
      }
    } catch (error) {
      this.logger.error(`Error al crear empleado(s): ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Actualizar uno o múltiples empleados
   */
  async update(employeeData: UpdateEmployeeDto | UpdateEmployeeDto[]) {
    try {
      const collection = this.mongodbService.getCollection<Employee>(this.COLLECTION_NAME);
      const now = new Date();
      
      if (Array.isArray(employeeData)) {
        // Actualización masiva usando bulkWrite
        const operations = employeeData.map(employee => {
          const { _id, ...updateData } = employee;
          return {
            updateOne: {
              filter: { _id: new ObjectId(_id) },
              update: { 
                $set: { 
                  ...updateData,
                  updateAt: now 
                } 
              }
            }
          };
        });
        
        return await collection.bulkWrite(operations);
      } else {
        // Actualizar un solo empleado
        const { _id, ...updateData } = employeeData;
        
        const result = await collection.updateOne(
          { _id: new ObjectId(_id) },
          { 
            $set: { 
              ...updateData,
              updateAt: now 
            } 
          }
        );

        if (result.matchedCount === 0) {
          throw new NotFoundException(`Empleado con ID ${_id} no encontrado`);
        }
        
        return result;
      }
    } catch (error) {
      this.logger.error(`Error al actualizar empleado(s): ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Eliminar lógicamente uno o varios empleados
   */
  async delete(ids: string[]) {
    try {
      if (!ids || ids.length === 0) {
        throw new BadRequestException('Debe proporcionar al menos un ID');
      }
      
      const collection = this.mongodbService.getCollection<Employee>(this.COLLECTION_NAME);
      const now = new Date();
      
      // Convertir array de strings a array de ObjectId
      const objectIds = ids.map(id => new ObjectId(id));
      
      // Eliminación lógica masiva
      const result = await collection.updateMany(
        { _id: { $in: objectIds } },
        { $set: { isDelete: true, updateAt: now } }
      );

      if (result.matchedCount === 0) {
        throw new NotFoundException(`No se encontraron empleados con los IDs proporcionados`);
      }
      
      return {
        deletedCount: result.modifiedCount,
        message: `${result.modifiedCount} empleado(s) eliminado(s) lógicamente`
      };
    } catch (error) {
      this.logger.error(`Error al eliminar empleado(s): ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Buscar un empleado por su ID
   */
  async findById(id: string) {
    try {
      const collection = this.mongodbService.getCollection<Employee>(this.COLLECTION_NAME);
      
      const employee = await collection.findOne({ 
        _id: new ObjectId(id),
        isDelete: false 
      });
      
      if (!employee) {
        throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
      }
      
      return employee;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error al buscar empleado por ID: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Buscar todos los empleados (no eliminados)
   */
  async findAll(query: QueryEmployeeDto) {
    try {
      const collection = this.mongodbService.getCollection<Employee>(this.COLLECTION_NAME);
      const { 
        page = 1, 
        limit = 10, 
        sortBy, 
        sortOrder = 'asc',
        minAge,
        maxAge,
        ...filters
      } = query;
      
      // Construir filtro base (solo no eliminados)
      const baseFilter: any = { isDelete: false };
      
      // Agregar filtros adicionales
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          if (typeof filters[key] === 'string') {
            // Búsqueda insensible a mayúsculas/minúsculas para campos de texto
            baseFilter[key] = { $regex: filters[key], $options: 'i' };
          } else {
            baseFilter[key] = filters[key];
          }
        }
      });
      
      // Agregar filtro de rango de edad si está definido
      if (minAge !== undefined || maxAge !== undefined) {
        baseFilter.age = {};
        if (minAge !== undefined) baseFilter.age.$gte = minAge;
        if (maxAge !== undefined) baseFilter.age.$lte = maxAge;
      }
      
      // Opciones de paginación
      const skip = (page - 1) * limit;
      
      // Opciones de ordenamiento
      const sort: any = {};
      if (sortBy) {
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
      }
      
      // Ejecutar consulta para obtener datos y total
      const [employees, total] = await Promise.all([
        collection.find(baseFilter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .toArray(),
        collection.countDocuments(baseFilter)
      ]);
      
      return {
        data: employees,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      this.logger.error(`Error al buscar empleados: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Buscar empleados por departamento
   */
  async findByDepartament(departament: string, query: QueryEmployeeDto) {
    try {
      return this.findAll({
        ...query,
        departament
      });
    } catch (error) {
      this.logger.error(`Error al buscar empleados por departamento: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Buscar empleados por posición/cargo
   */
  async findByPosition(position: string, query: QueryEmployeeDto) {
    try {
      return this.findAll({
        ...query,
        position
      });
    } catch (error) {
      this.logger.error(`Error al buscar empleados por posición: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Búsqueda avanzada con múltiples criterios
   */
  async advancedSearch(query: QueryEmployeeDto) {
    try {
      return this.findAll(query);
    } catch (error) {
      this.logger.error(`Error en la búsqueda avanzada: ${error.message}`, error.stack);
      throw error;
    }
  }
}
