import { Router } from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
} from "../controllers/like.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const likeRouter = Router();
likeRouter.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

likeRouter.route("/toggleVideoLikes/:videoId").post(toggleVideoLike);
likeRouter.route("/toggleCommentLikes/:commentId").post(toggleCommentLike);
likeRouter.route("/toggleTweetLikes/:tweetId").post(toggleTweetLike);
likeRouter.route("/get/videos").get(getLikedVideos);

export { likeRouter }