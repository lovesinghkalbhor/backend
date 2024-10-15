import { Router } from 'express';
import {
    getSubscribedChannels,
    getSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const subscriptionRouter = Router();
subscriptionRouter.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

subscriptionRouter.route("/togglesubscription/:channelId").post(toggleSubscription);
subscriptionRouter.route("/getsubscribedchannels/").get(getSubscribedChannels)
subscriptionRouter.route("/getsubscribers/").get(getSubscribers);

export { subscriptionRouter }