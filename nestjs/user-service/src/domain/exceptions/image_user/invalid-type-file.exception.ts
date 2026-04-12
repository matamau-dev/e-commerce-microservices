import { DomainException } from '../domain.exception';

export class InvalidTypeFileException extends DomainException {
	constructor(typeFile: string) {
		super(`El tipo de archivo ${typeFile} no es valido.`);
	}
}
