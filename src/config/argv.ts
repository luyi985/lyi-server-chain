type ARGS = 'portListenTo' | 'hostListenTo' | 'serverPort';

export type IOptions = {
	[k in ARGS]: string;
};

const options: IOptions = {
	portListenTo: '3000',
	hostListenTo: 'localhost',
	serverPort: '3000',
};

const argsParse = () => {
	const args = process.argv;
	const input = args.filter((arg) => arg.indexOf('=') > 0);
	if (!input.length) return {};
	const inputObj = input.reduce((acc, current) => {
		const parsed = current.split('=');
		return parsed[1] ? { ...acc, [parsed[0]]: parsed[1] } : { ...acc };
	}, {});
	return { ...options, ...inputObj };
};
const parsedOption = argsParse() as IOptions;
export default parsedOption;
