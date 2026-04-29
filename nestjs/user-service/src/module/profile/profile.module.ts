import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeleteProfileImageUseCase } from 'src/application/use-cases/profile-image/delete-profile-image/delete-profile-image.use-case';
import { GetProfileImageUseCase } from 'src/application/use-cases/profile-image/get-profile-image/get-profile-image.use-case';
import { UploadProfileImageUseCase } from 'src/application/use-cases/profile-image/upload-profile-image/upload-profile-image.use-case';
import { FilesOrmEntity } from 'src/infrastructure/database/postgres/orm-entities/file.orm-entity';
import { UserOrmEntity } from 'src/infrastructure/database/postgres/orm-entities/user.orm-entity';
import { FilePgRepository } from 'src/infrastructure/database/postgres/repositories/file.pg-repository';
import { LocalStorageService } from 'src/infrastructure/storage/local-storage.service';
import { ProfileImageController } from 'src/presentation/controllers/profile-image.controller';

@Module({
	imports: [TypeOrmModule.forFeature([FilesOrmEntity, UserOrmEntity])],
	controllers: [ProfileImageController],
	providers: [
		{ provide: 'ProfileImageReader', useClass: FilePgRepository },
		{ provide: 'ProfileImageWriter', useClass: FilePgRepository },
		{ provide: 'LocalStorageService', useClass: LocalStorageService },
		{
			provide: GetProfileImageUseCase,
			useFactory: (localStorageService) =>
				new GetProfileImageUseCase(localStorageService),
			inject: ['LocalStorageService'], //
		},
		{
			provide: UploadProfileImageUseCase,
			useFactory: (profileWriter, profileReader, localStorageService) =>
				new UploadProfileImageUseCase(
					profileWriter,
					profileReader,
					localStorageService,
				),
			inject: [
				'ProfileImageWriter',
				'ProfileImageReader',
				'LocalStorageService',
			],
		},
		{
			provide: DeleteProfileImageUseCase,
			useFactory: (profileReader, localStorageService) =>
				new DeleteProfileImageUseCase(
					profileReader,
					localStorageService,
				),
			inject: ['ProfileImageReader', 'LocalStorageService'],
		},
	],
})
export class ProfileModule {}
