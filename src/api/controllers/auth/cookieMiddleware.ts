import { Request, Response, NextFunction } from 'express';
import { getCookie } from '../../../utils/cookie-handler';
export const cookieMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const cookie = req.cookies.kfirCookie;
    const dycryptedCookie = getCookie(cookie || '');
    console.log('dycryptedCookie, Date.now()');
    next();
};
