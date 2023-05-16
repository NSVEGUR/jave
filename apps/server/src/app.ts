import express from 'express';
import config from './config';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';
import API from './controllers/api.controller';
import AppError from './utils/appError.util';
import ErrorController from './controllers/error.controller';
import AdminRoute from './routes/admin.route';
import UserRoute from './routes/user.route';
import FilmRoute from './routes/film.route';

const app = express();

app.use(helmet());

if (config.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//For CORS
const whitelist = ['http://localhost:3001'];
app.use(
	cors({
		origin: function (origin, callback) {
			// // Uncomment this part for allowing only certain origins by whitelisting them
			// if (!origin) {
			// 	return callback(
			// 		new AppError(
			// 			'Origin is not provided in request header',
			// 			400
			// 		)
			// 	);
			// }
			// if (!whitelist.includes(origin)) {
			// 	return callback(
			// 		new AppError(
			// 			`Cors origin request error, origin ${origin}`,
			// 			400
			// 		)
			// 	);
			// }
			callback(null, true);
		}
	})
);

//Data Sanitisation against XSS
app.use(xss());
//Prevent Parameter Pollution
app.use(
	hpp({
		whitelist: [] //Parameters for which we don't wanna restrict duplications
	})
);

app.use(API.protect);
app.use('/api/v1/admin', AdminRoute);
app.use('/api/v1/user', UserRoute);
app.use('/api/v1/film', FilmRoute);

app.use('*', (req, res, next) => {
	next(
		new AppError(
			`Can't find requested URL - ${req.url} on this server`,
			404
		)
	);
});

app.use(ErrorController);

export { app };
