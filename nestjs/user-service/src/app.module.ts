import { Module } from '@nestjs/common';
import { Argon2Service } from './infrastructure/services/argon2.service';
import { AppConfigModule } from './config/config.module';
import { PostgresModule } from './infrastructure/database/postgres/typeorm.module';
import { UserServiceModule } from './user-service.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './infrastructure/jwt/jwt.strategy';

@Module({
	imports: [
		AppConfigModule,
		PostgresModule,
		UserServiceModule,
		PassportModule.register({ defaultStrategy: 'jwt' }),
	],
	controllers: [],
	providers: [
		Argon2Service,
		JwtStrategy,
		{ provide: 'HASH_SERVICE', useClass: Argon2Service },
	],
})
export class AppModule {}
