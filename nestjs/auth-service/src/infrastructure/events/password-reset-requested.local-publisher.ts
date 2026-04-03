import { Injectable, Logger } from '@nestjs/common';
import {
	PasswordResetRequestedEvent,
	PasswordResetRequestedPublisher,
} from 'src/domain/events/password-reset-requested.publisher';

@Injectable()
export class PasswordResetRequestedLocalPublisher
	implements PasswordResetRequestedPublisher
{
	private readonly logger = new Logger(
		PasswordResetRequestedLocalPublisher.name,
	);

	async publish(event: PasswordResetRequestedEvent): Promise<void> {
		this.logger.log(
			`Evento publicado: Solicitud de restablecimiento de contraseña para ${event.email} (UserId: ${event.userId})`,
		);
		// TODO: En el futuro, enviar este evento a RabbitMQ/Kafka o usar EventEmitter para despachar el evento asíncrono
	}
}
