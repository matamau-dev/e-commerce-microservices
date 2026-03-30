import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeleteAccountUseCase } from 'src/application/use-cases/user/delete-account/delete-account.use-case';
import { GetProfileUseCase } from 'src/application/use-cases/user/get-profile/get-profile.use-case';
import { RegisterClientUseCase } from 'src/application/use-cases/user/register-client/register-client.use-case';
import { UpdatePasswordUseCase } from 'src/application/use-cases/user/update-password/update-password.use-case';
import { UpdateProfileUsecase } from 'src/application/use-cases/user/update-profile/update-profile.use-case';
import { UserOrmEntity } from 'src/infrastructure/database/postgres/orm-entities/user.orm-entity';
import { UserPgRepository } from 'src/infrastructure/database/postgres/repositories/user.pg-repository';
import { Argon2Service } from 'src/infrastructure/services/argon2.service';
import { UserController } from 'src/presentation/controllers/user.controller';

@Module({
	imports: [TypeOrmModule.forFeature([UserOrmEntity])],
	controllers: [UserController],
	providers: [
		{
			provide: 'UserReader',
			useClass: UserPgRepository,
		},
		{
			provide: 'UserVerification',
			useClass: UserPgRepository,
		},
		{
			provide: 'UserWriter',
			useClass: UserPgRepository,
		},
		{
			provide: 'HashService',
			useClass: Argon2Service,
		},
		{
			provide: RegisterClientUseCase,
			useFactory: (userWriter, userVerification, hashService) =>
				new RegisterClientUseCase(
					userWriter,
					userVerification,
					hashService,
				),
			inject: ['UserWriter', 'UserVerification', 'HashService'],
		},
		{
			provide: GetProfileUseCase,
			useFactory: (userReader) => new GetProfileUseCase(userReader),
			inject: ['UserReader'],
		},
		{
			provide: UpdateProfileUsecase,
			useFactory: (userReader, userWriter) =>
				new UpdateProfileUsecase(userReader, userWriter),
			inject: ['UserReader', 'UserWriter'],
		},
		{
			provide: UpdatePasswordUseCase,
			useFactory: (userReader, userWriter, hashService) =>
				new UpdatePasswordUseCase(userReader, userWriter, hashService),
			inject: ['UserReader', 'UserWriter', 'HashService'],
		},
		{
			provide: DeleteAccountUseCase,
			useFactory: (userReader, userWriter, hashService) =>
				new DeleteAccountUseCase(userReader, userWriter, hashService),
			inject: ['UserReader', 'UserWriter', 'HashService'],
		},
	],
})
export class UserModule {}
