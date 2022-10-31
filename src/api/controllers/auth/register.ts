import { Request, Response } from 'express';
export const register = async (req: Request, res: Response) => {
    return res.status(200).send('REGISTER ROUTE');
};
