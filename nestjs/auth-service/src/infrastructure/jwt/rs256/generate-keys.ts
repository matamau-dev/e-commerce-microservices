import { generateKeyPairSync } from 'crypto';
import { writeFileSync } from 'fs';
import { join } from 'path';

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
	modulusLength: 4096,
	publicKeyEncoding: { type: 'spki', format: 'pem' },
	privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

writeFileSync(join(__dirname, 'private.key'), privateKey);
writeFileSync(join(__dirname, 'public.key'), publicKey);

console.log('RSA key pair generated and saved to files.');
