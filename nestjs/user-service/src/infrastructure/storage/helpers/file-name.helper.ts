import { v4 as uuid } from 'uuid';

export const fileName = (
	req: Express.Request,
	file: Express.Multer.File,
	callback: Function,
) => {
	if (!file) return callback(new Error('No file provided'), false);

	const fileExtension = file.mimetype.split('/')[1];
	const newFileName = `${uuid()}.${fileExtension}`;
	callback(null, newFileName);
};
