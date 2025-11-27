import { Router } from 'express';
import { createWorkspace, getAllWorkspace } from '../controllers/workspace.controller';
import { protect } from '../controllers/auth.controller';

export const workspaceRouter = Router();

workspaceRouter.route('/').get(protect, getAllWorkspace).post(protect, createWorkspace);
