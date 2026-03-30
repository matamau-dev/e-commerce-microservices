import { Module } from '@nestjs/common';
import { Argon2Service } from './infrastructure/services/argon2.service';
import { AppConfigModule } from './config/config.module';
import { PostgresModule } from './infrastructure/database/postgres/typeorm.module';
import { UserServiceModule } from './user-service.module';

@Module({
	imports: [AppConfigModule, PostgresModule, UserServiceModule],
	controllers: [],
	providers: [
		Argon2Service,
		{ provide: 'HASH_SERVICE', useClass: Argon2Service },
	],
})
export class AppModule {}
