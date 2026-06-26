import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { ProductServiceModule } from './module/product-service.module';
import { PostgresModule } from './infrastructure/database/postgres/typeorm.module';

@Module({
	imports: [AppConfigModule, PostgresModule, ProductServiceModule],
	providers: [
		// Argon2Service,
		// JwtStrategy,
		// { provide: 'HASH_SERVICE', useClass: Argon2Service },
	],
})
export class AppModule {}
