import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainException } from 'src/domain/exceptions/domain.exception';

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let message: any = 'Internal server error';

		if (exception instanceof HttpException) {
			status = exception.getStatus();
			const exceptionResponse = exception.getResponse();
			message =
				typeof exceptionResponse === 'string'
					? exceptionResponse
					: (exceptionResponse as any).message || exception.message;
		} else if (exception instanceof DomainException) {
			status = this.mapDomainExceptionToHttpStatus(exception);
			message = exception.message;
		} else {
			console.error('[Unhandled Exception]:', exception);
			message = exception.message || 'Internal server error';
		}

		response.status(status).json({
			error: true,
			status: status,
			message: message,
		});
	}

	private mapDomainExceptionToHttpStatus(exception: DomainException): number {
		const exceptionName = exception.name;

		if (exceptionName.includes('AlreadyExists')) {
			return HttpStatus.CONFLICT;
		}
		if (exceptionName.includes('NotFound')) {
			return HttpStatus.NOT_FOUND;
		}
		if (
			exceptionName.includes('Invalid') ||
			exceptionName.includes('Same') ||
			exceptionName.includes('Empty') ||
			exceptionName.includes('Validation')
		) {
			return HttpStatus.BAD_REQUEST;
		}

		return HttpStatus.BAD_REQUEST;
	}
}
