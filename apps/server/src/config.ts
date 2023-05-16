import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
	path: path.resolve(__dirname, './../.env')
});

interface ENV {
	NODE_ENV: string | undefined;
	PORT: number | undefined;
	API_KEY: string | undefined;
	DATABASE_URL: string | undefined;

	JWT_KEY: string | undefined;
	JWT_EXPIRES_IN: string | undefined;

	FILE_STORE: string | undefined;
}

interface CONFIG {
	NODE_ENV: string;
	PORT: number;
	API_KEY: string;
	DATABASE_URL: string;

	JWT_KEY: string;
	JWT_EXPIRES_IN: string;

	FILE_STORE: string;
}

const getEnv = (): ENV => {
	return {
		NODE_ENV: process.env.NODE_ENV,
		PORT: process.env.PORT
			? Number(process.env.PORT)
			: undefined,
		API_KEY: process.env.API_KEY,
		DATABASE_URL: process.env.DATABASE_URL,

		JWT_KEY: process.env.JWT_KEY,
		JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,

		FILE_STORE: process.env.FILE_STORE
	};
};

const getConfig = (env: ENV): CONFIG => {
	for (const [key, value] of Object.entries(env)) {
		if (value === undefined) {
			throw new Error(
				`Missing key ${key} in config.env`
			);
		}
	}
	return env as CONFIG;
};

const config = getConfig(getEnv());
export default config;
