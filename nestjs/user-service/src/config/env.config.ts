import { EnvVars } from './env.validation';

export const envConfig = () => {
	const env = process.env as unknown as EnvVars;

	return {
		app: {
			nodeEnv: env.NODE_ENV,
			port: Number(env.PORT) || 3001,
		},
		database: {
			host: env.DB_HOST,
			port: Number(env.DB_PORT) || 5432,
			user: env.DB_USER,
			password: env.DB_PASSWORD,
			name: env.DB_BASE,
		},
		argon2: {
			type: Number(env.ARGON2_TYPE) || 2,
			memoryCost: Number(env.ARGON2_MEMORY_COST) || 65536,
			timeCost: Number(env.ARGON2_TIME_COST) || 3,
			parallelism: Number(env.ARGON2_PARALLELISM) || 4,
		},
	};
};

export type EnvConfig = ReturnType<typeof envConfig>;
