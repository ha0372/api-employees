import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  
  // Configurar validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Habilitar CORS
  app.enableCors({
    origin: '*', // Permitir todas las solicitudes de cualquier origen
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
    allowedHeaders: 'Content-Type, Accept, Authorization', // Encabezados permitidos
  });
  
  // Añadir prefijo global a la API
  app.setGlobalPrefix('api');

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Gestión de Empleados')
    .setDescription('API RESTful para la gestión de empleados usando MongoDB nativo')
    .setVersion('1.0')
    .addTag('employees', 'Operaciones relacionadas con empleados')
    .addBearerAuth() // Si planeas usar autenticación JWT en el futuro
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  // Obtener puerto de configuración
  const configService = app.get(ConfigService);
  const port = process.env.PORT || 4000;
  
  await app.listen(port);
  logger.log(`Aplicación iniciada en: http://localhost:${port}/api`);
  logger.log(`Documentación Swagger disponible en: http://localhost:${port}/api/docs`);
}
bootstrap();