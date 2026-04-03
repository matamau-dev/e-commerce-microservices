import { DomainException } from './domain.exception';

export class TwoFactorRequiredException extends DomainException {
	constructor() {
		super('Se requiere verificación 2FA');
	}
}
