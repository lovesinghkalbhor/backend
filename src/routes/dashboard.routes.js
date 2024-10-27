import { Router } from 'express';
import { getChannelStats, getChannelVideos } from '../controllers/dashboard.controllers.js';

import { verifyJWT } from "../middlewares/auth.middleware.js"

const dashboardRouter = Router();
dashboardRouter.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

dashboardRouter.route("/channelstats/:channelId").get(getChannelStats)
dashboardRouter.route("/channelvideos/:channelId").get(getChannelVideos)

export { dashboardRouter } 