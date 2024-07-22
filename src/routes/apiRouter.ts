import express, {Request, Response} from 'express';
import {agentStatus} from "./globals";

export const apiRouter = express.Router();

apiRouter.get('/test', (req: Request, res: Response, next) => {
    res.json({
        message: 'hi'
    });
});

apiRouter.get('/agent-status', (req: Request, res: Response, next) => {
    const status: any = Array.from(agentStatus, ([agentId, isAvailable]) => ({ agentId, isAvailable }));
    res.json(status);
});

