import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { UserOrmEntity } from './orm-entities/user.orm-entity';

export const getTypeOrmConfig = (
	configService: ConfigService,
): TypeOrmModuleOptions => ({
	type: 'postgres',
	host: configService.get('database.host'),
	port: configService.get('database.port'),
	username: configService.get('database.user'),
	password: configService.get('database.password'),
	database: configService.get('database.name'),

	entities: [UserOrmEntity],

	migrations: [__dirname + '/migrations/*{.ts,.js}'],

	synchronize: false,
});

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT) || 5432,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_BASE,

	entities: [UserOrmEntity],

	migrations: [__dirname + '/migrations/*{.ts,.js}'],

	synchronize: false,
} as DataSourceOptions);
