import express, {Request, Response} from 'express';

export const pageRouter = express.Router();

pageRouter.get('/client-app', (req: Request, res: Response, next) => {
    res.render('client-app');
});
pageRouter.get('/cti-admin', (req: Request, res: Response, next) => {
    res.render('cti-admin'); 
});
