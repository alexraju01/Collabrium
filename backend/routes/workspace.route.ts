import { Router } from 'express';
import { createWorkspace, getAllWorkspace } from '../controllers/workspace.controller';

export const workspaceRouter = Router();

workspaceRouter.route('/').get(getAllWorkspace).post(createWorkspace);
