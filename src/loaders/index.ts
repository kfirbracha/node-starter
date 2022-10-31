import appLoader from './express';
import { Express } from 'express';

export default (app: Express) => {
    appLoader(app);
};
