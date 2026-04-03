import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

// Setup de configuración y módulos Globales
import { AppConfigModule } from './config/config.module';
import { PostgresModule } from './infrastructure/database/postgres/typeorm.module';

// Módulos Core generados por reestructuración de Clean Architecture
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { ApplicationModule } from './application/application.module';
import { PresentationModule } from './presentation/presentation.module';

@Module({
	imports: [
		// 1. Configuración general y de seguridad
		AppConfigModule,
		ThrottlerModule.forRoot({
			throttlers: [{ ttl: 60000, limit: 10 }], // 10 requests por minuto
		}),

		// 2. Base de datos e Inyecciones de ORM globales
		PostgresModule,

		// 3. Módulos Core - Clean Architecture
		InfrastructureModule,
		ApplicationModule,
		PresentationModule,
	],
	controllers: [],
	providers: [],
})
export class AuthModule { }
