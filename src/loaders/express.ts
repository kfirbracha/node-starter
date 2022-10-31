import cors from 'cors';
import bodyParser from 'body-parser';
import routes from '../api/routes/index';
import { BaseAppError } from '../utils/app-error';
import express, { Express, Request, Response, NextFunction } from 'express';
export default (app: Express) => {
    process.on('uncaughtException', async (error) => {
        console.log(`ERROR ${error.message} SHOULD LOG INTO DB`);
    });
    process.on('unhandledRejection', async (ex: Error) => {
        console.log(`ERROR ${ex.message} SHOULD LOG INTO DB`);
    });

    app.enable('trust proxy');
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.disable('x-powered-by');
    app.disable('etag');
    app.use('/api', routes);

    app.get('/', (_req: Request, res: Response) => {
        return res.status(200).json({
            message: 'SUCCESS',
            CODE: '00006',
        });
    });

    app.use((req: Request, res: Response, next: NextFunction) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        );
        res.header(
            'Content-Security-Policy-Report-Only',
            'default-src: https:'
        );
        if (req.method === 'OPTIONS') {
            res.header(
                'Access-Control-Allow-Methods',
                'PUT POST PATCH DELETE GET'
            );
            return res.status(200).json({});
        }
        next();
    });
    app.use((_req: Request, _res: Response, next: NextFunction) => {
        console.log(_req.url);
        const error: BaseAppError = new BaseAppError(
            'Endpoint could not find!',
            404
        );
        next(error);
    });

    app.use(
        (
            error: BaseAppError,
            req: Request,
            res: Response,
            next: NextFunction
        ) => {
            res.status(error.status || 500);
            let resultCode = '00015';
            let level = 'External Error';
            if (error.status === 500) {
                resultCode = '00013';
                level = 'Server Error';
            } else if (error.status === 404) {
                resultCode = error.status.toString();
                level = 'Client Error';
            }
            console.log(
                resultCode,
                req?.body?.user?._id ?? '',
                error.message,
                level
            );
            return res.json({
                message: error.message,
                resultCode: resultCode,
            });
        }
    );
};
