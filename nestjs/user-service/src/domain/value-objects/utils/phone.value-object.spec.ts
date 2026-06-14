import { PhoneNumber } from './phone.value-object';

describe('PhoneNumber Value Object', () => {
	describe('create', () => {
		describe('when given valid phone numbers', () => {
			it('should create a phone number instance with a valid 10-digit string', () => {
				const phone = PhoneNumber.create('9611234567');

				expect(phone.getValue()).toBe('9611234567');
			});

			it('should strip non-numeric characters from the input', () => {
				const phone = PhoneNumber.create('961-123-4567');

				expect(phone.getValue()).toBe('9611234567');
			});

			it('should strip the country code 52 if the numeric length is 12 digits', () => {
				const phone = PhoneNumber.create('529611234567');

				expect(phone.getValue()).toBe('9611234567');
			});

			it('should strip parenthesis and whitespaces', () => {
				const phone = PhoneNumber.create('(961) 123 4567');

				expect(phone.getValue()).toBe('9611234567');
			});
		});

		describe('when given invalid phone numbers', () => {
			it('should throw an error when the phone number is empty', () => {
				expect(() => PhoneNumber.create('')).toThrow(
					'Phone number is required',
				);
			});

			it('should throw an error when the phone number is null', () => {
				expect(() => PhoneNumber.create(null as any)).toThrow(
					'Phone number is required',
				);
			});

			it('should throw an error when the phone number is undefined', () => {
				expect(() => PhoneNumber.create(undefined as any)).toThrow(
					'Phone number is required',
				);
			});

			it('should throw an error when the normalized number is less than 10 digits', () => {
				expect(() => PhoneNumber.create('96112345')).toThrow(
					'Invalid Mexican phone number',
				);
			});

			it('should throw an error when the normalized number is more than 10 digits without a country code', () => {
				expect(() => PhoneNumber.create('96112345678')).toThrow(
					'Invalid Mexican phone number',
				);
			});
		});
	});

	describe('format', () => {
		it('should return the phone number formatted as "XXX XXX XXXX"', () => {
			const phone = PhoneNumber.create('9611234567');

			expect(phone.format()).toBe('961 123 4567');
		});
	});

	describe('equals', () => {
		it('should return true when comparing two equivalent phone numbers', () => {
			const a = PhoneNumber.create('9611234567');
			const b = PhoneNumber.create('961-123-4567');

			expect(a.equals(b)).toBe(true);
		});

		it('should return false when comparing two different phone numbers', () => {
			const a = PhoneNumber.create('9611234567');
			const b = PhoneNumber.create('9619876543');

			expect(a.equals(b)).toBe(false);
		});
	});
});
