import { ValidationException } from 'src/domain/exceptions/validation.exception';
import { Email } from './email.value-object';

describe('Email Value Object', () => {
	describe('create', () => {
		describe('when a valid email is provided', () => {
			it('should create an Email instance', () => {
				const email = Email.create('juan@gmail.com');

				expect(email).toBeInstanceOf(Email);
			});

			it('should normalize the email to lowercase', () => {
				const email = Email.create('Juan@Gmail.COM');

				expect(email.getValue()).toBe('juan@gmail.com');
			});

			it('should remove leading and trailing whitespace', () => {
				const email = Email.create('  juan@gmail.com  ');

				expect(email.getValue()).toBe('juan@gmail.com');
			});
		});

		describe('when an invalid email is provided', () => {
			it('should throw ValidationException when the email is empty', () => {
				expect(() => Email.create('')).toThrow(ValidationException);
			});

			it('should throw ValidationException when the email contains only whitespace', () => {
				expect(() => Email.create('   ')).toThrow(ValidationException);
			});

			it('should throw ValidationException when the email is null', () => {
				expect(() => Email.create(null as any)).toThrow(
					ValidationException,
				);
			});

			it('should throw ValidationException when the email is undefined', () => {
				expect(() => Email.create(undefined as any)).toThrow(
					ValidationException,
				);
			});

			it('should throw ValidationException when the email does not contain an at symbol', () => {
				expect(() => Email.create('juangmail.com')).toThrow(
					ValidationException,
				);
			});

			it('should throw ValidationException when the email does not contain a domain', () => {
				expect(() => Email.create('juan@')).toThrow(
					ValidationException,
				);
			});

			it('should throw ValidationException when the email does not contain a valid domain extension', () => {
				expect(() => Email.create('juan@gmail')).toThrow(
					ValidationException,
				);
			});
		});
	});

	describe('equals', () => {
		it('should return true when both emails represent the same normalized value', () => {
			const firstEmail = Email.create('juan@gmail.com');
			const secondEmail = Email.create('JUAN@GMAIL.COM');

			expect(firstEmail.equals(secondEmail)).toBe(true);
		});

		it('should return false when emails represent different values', () => {
			const firstEmail = Email.create('juan@gmail.com');
			const secondEmail = Email.create('pedro@gmail.com');

			expect(firstEmail.equals(secondEmail)).toBe(false);
		});
	});

	describe('getValue', () => {
		it('should return the normalized email value', () => {
			const email = Email.create(' Juan@Gmail.COM ');

			expect(email.getValue()).toBe('juan@gmail.com');
		});
	});
});
