import { HttpException, HttpStatus } from '@nestjs/common';

export const fileFilter = (
	req: Express.Request,
	file: Express.Multer.File,
	callback: Function,
) => {
	if (!file) return callback(new Error('No file provided'), false);
	const fileExtension = file.mimetype.split('/')[1];
	const allowedExtensions = [
		'png',
		'jpg',
		'jpeg',
		'gif',
		'bmp',
		'tiff',
		'webp',
		'avif',
	];

	if (!allowedExtensions.includes(fileExtension)) {
		return callback(
			new HttpException(
				'Tipo de archivo no permitido',
				HttpStatus.BAD_REQUEST,
			),
			false,
		);
	}

	callback(null, true);
};
