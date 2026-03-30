import * as Joi from 'joi';

export interface EnvVars {
	// App
	NODE_ENV: 'development' | 'production' | 'test';
	PORT: number;

	// PostgreSQL
	DB_HOST: string;
	DB_PORT: number;
	DB_USER: string;
	DB_PASSWORD: string;
	DB_BASE: string;

	// Argon2
	ARGON2_TYPE: number;
	ARGON2_MEMORY_COST: number;
	ARGON2_TIME_COST: number;
	ARGON2_PARALLELISM: number;
}

export const envValidationSchema = Joi.object({
	// App
	NODE_ENV: Joi.string()
		.valid('development', 'production', 'test')
		.required(),
	PORT: Joi.number().default(3001),

	// PostgreSQL
	DB_HOST: Joi.string().required(),
	DB_PORT: Joi.number().default(5432),
	DB_USER: Joi.string().required(),
	DB_PASSWORD: Joi.string().required(),
	DB_BASE: Joi.string().required(),

	// Argon2
	ARGON2_TYPE: Joi.number().valid(0, 1, 2).default(2),
	ARGON2_MEMORY_COST: Joi.number().min(8192).default(65536),
	ARGON2_TIME_COST: Joi.number().min(1).default(3),
	ARGON2_PARALLELISM: Joi.number().min(1).default(4),
}).unknown(true);
