// presentation/controllers/profile-image.controller.ts
import {
	Controller,
	Post,
	Get,
	Param,
	UploadedFile,
	UseInterceptors,
	UseGuards,
	Res,
	Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { Response } from 'express';
import { fileFilter } from '../../infrastructure/storage/helpers/file-filter.helper';
import { fileName } from '../../infrastructure/storage/helpers/file-name.helper';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UploadProfileImageUseCase } from '../../application/use-cases/profile-image/upload-profile-image/upload-profile-image.use-case';
import { GetProfileImageUseCase } from '../../application/use-cases/profile-image/get-profile-image/get-profile-image.use-case';
import { Auth } from '../decorators/auth.decorator';
import { RoleEnum } from 'src/domain/enums/role.enum';
import { DeleteProfileImageUseCase } from 'src/application/use-cases/profile-image/delete-profile-image/delete-profile-image.use-case';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Auth(RoleEnum.CLIENTE)
@Controller('users/profile-image')
export class ProfileImageController {
	constructor(
		private readonly uploadProfileImage: UploadProfileImageUseCase,
		private readonly getProfileImage: GetProfileImageUseCase,
		private readonly deleteProfileImage: DeleteProfileImageUseCase,
	) {}

	@Post()
	@ApiBody({
		description:
			'Esto es para la foto de perfil del usuario, se puede subir una sola imagen.',
		schema: {
			type: 'object',
			properties: {
				folder: {
					type: 'string',
					description: 'Carpeta donde se almacenará el archivo',
					example: 'profile-images',
				},
				file: {
					type: 'string',
					format: 'binary',
					description: 'Archivo de imagen a subir',
					example: 'foto.jpg',
					nullable: false,
				},
			},
		},
	})
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(
		FileInterceptor('file', {
			fileFilter,
			limits: { fileSize: 1024 * 1024 * 5 }, // 5MB máximo
			storage: diskStorage({
				destination: './uploads/profile-images',
				filename: fileName,
			}),
		}),
	)
	upload(
		@CurrentUser('id') userId: string,
		@UploadedFile() file: Express.Multer.File,
	) {
		return this.uploadProfileImage.execute({
			userId,
			fileName: file.filename, // uuid.jpg — generado por fileName helper
			originalName: file.originalname, // nombre original del archivo
			typeFile: file.mimetype, // image/jpeg
			folder: 'profile-images',
		});
	}

	// Obtener imagen — ruta pública, Flutter la usa en un Image.network()
	@Get(':folder/:fileName')
	getImage(
		@Param('fileName') fileName: string,
		@Param('folder') folder: string,
		@Res() res: Response,
	) {
		console.log(`Entro al folder ${folder}`);
		console.log(`Con el nombre del archivo ${fileName}`);
		const { absolutePath } = this.getProfileImage.execute({
			fileName,
			folder,
		});
		res.sendFile(absolutePath);
	}

	@Delete(':folder/:fileName')
	deleteImage(
		@CurrentUser('id') userId: string,
		@Param('fileName') fileName: string,
		@Param('folder') folder: string,
	) {
		return this.deleteProfileImage.execute({
			userId,
			fileName,
			folder,
		});
	}
}
