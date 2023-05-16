import { app } from './app';
import config from './config';

const port = config.PORT || 3000;

const server = app.listen(port, () => {
	console.log(
		`🚀 server started listening at http://localhost:${port}`
	);
});

process.on('uncaughtException', (err) => {
	console.log('💥 uncaught exception: ', err.message);
	console.log('🤕 closing server now');
	process.exit(1);
});

process.on('unhandledRejection', (err) => {
	console.log('⛔️ unhandled rejection');
	console.log(err);
	server.close(() => {
		process.exit(1);
	});
});

process.on('SIGTERM', () => {
	console.log(
		'👀 SIGTERM received. Shutting down gracefully..'
	);
	server.close(() => {
		console.log(' ✅ closed remaining connections');
		process.exit(0);
	});
});
