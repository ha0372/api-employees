import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { MongoClient, Db, Collection, Document } from 'mongodb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongodbService implements OnModuleInit, OnModuleDestroy {
  private client: MongoClient;
  private db: Db;
  private readonly logger = new Logger('MongodbService');

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      const uri = this.configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017';
      const dbName = this.configService.get<string>('DB_NAME') || 'employeeDB';

      this.client = new MongoClient(uri);
      await this.client.connect();
      this.db = this.client.db(dbName);
      
      this.logger.log('Conectado exitosamente a MongoDB');
      
      // Crear índices para la colección de empleados
      await this.createEmployeeIndexes();
    } catch (error) {
      this.logger.error('Error al conectar a MongoDB', error.stack);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.close();
      this.logger.log('Conexión a MongoDB cerrada');
    }
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error('¡La conexión a la base de datos no está establecida!');
    }
    return this.db;
  }

  getCollection<T extends Document = Document>(name: string): Collection<T> {
    return this.getDb().collection<T>(name);
  }

  private async createEmployeeIndexes() {
    const collection = this.getCollection('employees');
    
    // Crear índices para optimizar búsquedas
    await Promise.all([
      collection.createIndex({ email: 1 }, { unique: true }),
      collection.createIndex({ name: 1, surnames: 1 }),
      collection.createIndex({ departament: 1 }),
      collection.createIndex({ position: 1 }),
      collection.createIndex({ isDelete: 1 }),
    ]);
    
    this.logger.log('Índices para la colección de empleados creados');
  }
}