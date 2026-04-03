import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ApplicationModule } from '../application/application.module';

// Controllers
import { AuthController } from './controllers/auth.controller';
import { TwoFactorController } from './controllers/two-factor.controller';
import { PasswordController } from './controllers/password.controller';

// Guards & Filters
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from '../infrastructure/jwt/jwt.strategy';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

@Module({
	imports: [
		ApplicationModule,
		InfrastructureModule, // Para extraer TokenService/HashService si Strategy lo necesita
		PassportModule.register({ defaultStrategy: 'jwt' }),
	],
	controllers: [AuthController, TwoFactorController, PasswordController],
	providers: [
		JwtAuthGuard,
		RolesGuard,
		JwtStrategy, // Pertenece a la infraestructura pero es un Provider de presentacion de Passport
	],
	exports: [JwtAuthGuard, RolesGuard],
})
export class PresentationModule {}
