import { Router } from 'express';
import { getAllWorkspace } from '../controllers/workspace.controller';

export const workspaceRouter = Router();

workspaceRouter.route('/').get(getAllWorkspace);
