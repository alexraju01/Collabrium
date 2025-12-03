import { Router } from 'express';
import { getDashboardData } from '../controllers/dashboard.controller';
import { protect } from '../controllers/auth.controller';

export const dashboardRouter = Router();

dashboardRouter.route('/').get(protect, getDashboardData);
