import { ValidationException } from 'src/domain/exceptions/validation.exception';
import { Email } from './email.value-object';

describe('Email Value Object', () => {
	describe('constructor', () => {
		describe('when given valid email addresses', () => {
			it('should successfully create an Email instance with the valid email', () => {
				const email = new Email('Juan@Gmail.COM');

				expect(email.getValue()).toBe('juan@gmail.com');
			});

			it('should normalize the email address to lowercase', () => {
				const email = new Email('USUARIO@DOMINIO.COM');

				expect(email.getValue()).toBe('usuario@dominio.com');
			});

			it('should trim leading and trailing whitespace from the email address', () => {
				const email = new Email('  juan@gmail.com  ');

				expect(email.getValue()).toBe('juan@gmail.com');
			});
		});

		describe('when given invalid email addresses', () => {
			it('should throw ValidationException when the email is empty', () => {
				expect(() => new Email('')).toThrow(ValidationException);
			});

			it('should throw ValidationException when the email contains only whitespace', () => {
				expect(() => new Email('   ')).toThrow(ValidationException);
			});

			it('should throw ValidationException when the email is null', () => {
				expect(() => new Email(null as any)).toThrow(ValidationException);
			});

			it('should throw ValidationException when the email is undefined', () => {
				expect(() => new Email(undefined as any)).toThrow(ValidationException);
			});

			it('should throw ValidationException when the email does not contain @', () => {
				expect(() => new Email('juangmail.com')).toThrow(
					ValidationException,
				);
			});

			it('should throw ValidationException when the email lacks a domain', () => {
				expect(() => new Email('juan@')).toThrow(ValidationException);
			});

			it('should throw ValidationException when the email lacks a domain extension', () => {
				expect(() => new Email('juan@gmail')).toThrow(ValidationException);
			});
		});
	});

	describe('equals', () => {
		it('should return true when comparing two identical email addresses', () => {
			const a = new Email('juan@gmail.com');
			const b = new Email('JUAN@GMAIL.COM');

			expect(a.equals(b)).toBe(true);
		});

		it('should return false when comparing two different email addresses', () => {
			const a = new Email('juan@gmail.com');
			const b = new Email('pedro@gmail.com');

			expect(a.equals(b)).toBe(false);
		});
	});
});
