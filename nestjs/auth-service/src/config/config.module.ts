import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './env.config';
import { envValidationSchema } from './env.validation';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: envValidationSchema,
			load: [envConfig],
			envFilePath: '.env',
		}),
	],
})
export class AppConfigModule {}
