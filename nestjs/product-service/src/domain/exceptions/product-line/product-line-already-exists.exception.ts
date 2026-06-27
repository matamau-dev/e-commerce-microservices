import { DomainException } from '../domain.exception';

export class ProductLineAlreadyExists extends DomainException {
	constructor(name: string) {
		super(`The name: "${name}" already exists.`);
	}
}
