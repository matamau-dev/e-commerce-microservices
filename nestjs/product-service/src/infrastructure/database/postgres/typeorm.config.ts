import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { CategoryOrmEntity } from './orm-entities/category.orm-entity';
import { BrandOrmEntity } from './orm-entities/brand.orm-entity';
import { ProductLineOrmEntity } from './orm-entities/product-line.orm-entity';

export const getTypeOrmConfig = (
	configService: ConfigService,
): TypeOrmModuleOptions => ({
	type: 'postgres',
	host: configService.get('database.host'),
	port: configService.get('database.port'),
	username: configService.get('database.user'),
	password: configService.get('database.password'),
	database: configService.get('database.name'),

	entities: [CategoryOrmEntity, BrandOrmEntity, ProductLineOrmEntity],

	migrations: [__dirname + '/migrations/*{.ts,.js}'],

	// logging: true,
	synchronize: true,
	dropSchema: false,
});

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT) || 5432,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_BASE,

	entities: [CategoryOrmEntity, BrandOrmEntity, ProductLineOrmEntity],

	migrations: [__dirname + '/migrations/*{.ts,.js}'],

	synchronize: false,
} as DataSourceOptions); //360153d2-db91-49d2-9742-2aacef808f08
