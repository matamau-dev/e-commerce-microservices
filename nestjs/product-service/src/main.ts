import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './presentation/filters/domain-exception.filter';

async function bootstrap() {
	const logger = new Logger('API PRODUCT-SERVICE');

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
	SwaggerModule.setup('product/api/v1/docs', app, document);

	app.enableCors({
		origin: '*',
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	});
	logger.log('Starting API... in http://localhost:' + process.env.PORTS);
	await app.listen(process.env.PORTS ?? 3000);

	logger.log(
		`The API is available at http://localhost:${process.env.PORTS ?? 3000}/product/api/v1`,
	);

	logger.verbose(
		`The Documentation is available at http://localhost:${process.env.PORTS ?? 3000}/product/api/v1/docs`,
	);
}
bootstrap();
