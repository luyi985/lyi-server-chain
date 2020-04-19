import { config } from 'dotenv';
import { resolve } from 'path';
import argvs, { IOptions } from './argv';

try {
	const c = config({ path: resolve(process.cwd(), '.env') });
	if (c.error) {
		throw c.error;
	}
} catch (e) {
	console.error(e);
}
export { argvs, IOptions };
