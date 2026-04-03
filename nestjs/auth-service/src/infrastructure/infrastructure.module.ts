import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '../config/config.module';
import { PostgresModule } from './database/postgres/typeorm.module';
import { HttpModule } from '@nestjs/axios';
import { JwtRs256Module } from './jwt/jwt-rs256.module';

// Repositories
import { SessionPgRepository } from './database/postgres/repositories/session.pg-repository';
import { RevokedTokenPgRepository } from './database/postgres/repositories/revoked-token.pg-repository';
import { TwoFactorPgRepository } from './database/postgres/repositories/two-factor.pg-repository';
import { LoginAttemptPgRepository } from './database/postgres/repositories/login-attempt.pg-repository';

// ORM Entities
import { SessionOrmEntity } from './database/postgres/orm-entities/session.orm-entity';
import { RevokedTokenOrmEntity } from './database/postgres/orm-entities/revoked-token.orm-entity';
import { TwoFactorOrmEntity } from './database/postgres/orm-entities/two-factor.orm-entity';
import { LoginAttemptOrmEntity } from './database/postgres/orm-entities/login-attempt.orm-entity';

// Infrastructure Services
import { JwtRs256Service } from './jwt/jwt-rs256.service';
import { TotpService } from './totp/totp.service';
import { UserServiceClient } from './http/user-service.client';
import { Argon2Service } from './service/argon2.service';
import { PasswordResetRequestedLocalPublisher } from './events/password-reset-requested.local-publisher';

const providers = [
	{ provide: 'SessionReader', useClass: SessionPgRepository },
	{ provide: 'SessionWriter', useClass: SessionPgRepository },
	{ provide: 'RevokedTokenReader', useClass: RevokedTokenPgRepository },
	{ provide: 'RevokedTokenWriter', useClass: RevokedTokenPgRepository },
	{ provide: 'TwoFactorReader', useClass: TwoFactorPgRepository },
	{ provide: 'TwoFactorWriter', useClass: TwoFactorPgRepository },
	{ provide: 'LoginAttemptReader', useClass: LoginAttemptPgRepository },
	{ provide: 'LoginAttemptWriter', useClass: LoginAttemptPgRepository },
	{ provide: 'TokenService', useClass: JwtRs256Service },
	{ provide: 'HashService', useClass: Argon2Service },
	{
		provide: 'PasswordResetRequestedPublisher',
		useClass: PasswordResetRequestedLocalPublisher,
	},
	TotpService,
	UserServiceClient,
];

@Module({
	imports: [
		AppConfigModule,
		PostgresModule,
		HttpModule,
		JwtRs256Module,
		TypeOrmModule.forFeature([
			SessionOrmEntity,
			RevokedTokenOrmEntity,
			TwoFactorOrmEntity,
			LoginAttemptOrmEntity,
		]),
	],
	providers: [...providers],
	exports: [...providers, AppConfigModule, PostgresModule, TypeOrmModule],
})
export class InfrastructureModule { }
