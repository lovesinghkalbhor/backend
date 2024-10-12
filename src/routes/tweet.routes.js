import { Router } from 'express';
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const tweetRouter = Router();

tweetRouter.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

tweetRouter.route("/add").post(createTweet);
tweetRouter.route("/get/:userId").get(getUserTweets);
tweetRouter.route("/update/:tweetId").patch(updateTweet)
tweetRouter.route("/delete/:tweetId").delete(deleteTweet);

export { tweetRouter }