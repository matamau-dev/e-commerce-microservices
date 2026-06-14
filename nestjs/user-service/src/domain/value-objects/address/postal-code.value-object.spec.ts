import { PostalCode } from './postal-code.value-object';

describe('PostalCode Value Object', () => {
	describe('create', () => {
		it('should create a valid PostalCode instance when a 5-digit numeric string is provided', () => {
			const postalCode = PostalCode.create('29000');

			expect(postalCode.getValue()).toBe('29000');
		});

		it('should trim leading and trailing whitespace from the postal code', () => {
			const postalCode = PostalCode.create(' 29000 ');

			expect(postalCode.getValue()).toBe('29000');
		});

		it('should throw an error when the postal code is empty', () => {
			expect(() => {
				PostalCode.create('');
			}).toThrow('Postal code is required');
		});

		it('should throw an error when the postal code is less than 5 digits', () => {
			expect(() => {
				PostalCode.create('1234');
			}).toThrow('Invalid Mexican postal code');
		});

		it('should throw an error when the postal code is more than 5 digits', () => {
			expect(() => {
				PostalCode.create('123456');
			}).toThrow('Invalid Mexican postal code');
		});

		it('should throw an error when the postal code contains non-numeric characters', () => {
			expect(() => {
				PostalCode.create('29A00');
			}).toThrow('Invalid Mexican postal code');
		});
	});

	describe('equals', () => {
		it('should return true when comparing two identical postal codes', () => {
			const postalCode1 = PostalCode.create('29000');
			const postalCode2 = PostalCode.create('29000');

			expect(postalCode1.equals(postalCode2)).toBe(true);
		});

		it('should return false when comparing two different postal codes', () => {
			const postalCode1 = PostalCode.create('29000');
			const postalCode2 = PostalCode.create('01000');

			expect(postalCode1.equals(postalCode2)).toBe(false);
		});
	});
});
