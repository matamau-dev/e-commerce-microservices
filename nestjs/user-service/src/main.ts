import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { promises as fs } from 'fs';
import * as path from 'path';
import { DomainExceptionFilter } from './presentation/filters/domain-exception.filter';

async function bootstrap() {
	await ensureUploadDirs();
	const logger = new Logger('API USER-SERVICE');
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	app.useGlobalFilters(new DomainExceptionFilter());
	app.setGlobalPrefix('api/v1');
	const config = new DocumentBuilder()
		.setTitle('API')
		.setDescription('API for e-commerce')
		.setVersion('1.0')
		.addBearerAuth({
			type: 'http',
			scheme: 'bearer',
			bearerFormat: 'JWT',
		})
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api/v1/docs', app, document);

	app.enableCors({
		origin: '*', // Cambiar por el dominio del frontend en producción
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	});
	logger.log('Starting API... in http://localhost:' + process.env.PORTS);
	await app.listen(process.env.PORTS ?? 3000);

	logger.log(
		`The API is available at http://localhost:${process.env.PORTS ?? 3000}/api/v1`,
	);

	logger.verbose(
		`The Documentation is available at http://localhost:${process.env.PORTS ?? 3000}/api/v1/docs`,
	);
}

async function ensureUploadDirs() {
	const dir = path.join(process.cwd(), 'uploads', 'profile-images');

	try {
		await fs.mkdir(dir, { recursive: true });
	} catch (error) {
		console.error('Error creando directorio uploads:', error);
	}
}
bootstrap();
