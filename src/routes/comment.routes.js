import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comments.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const commentRouter = Router();

commentRouter.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

commentRouter.route("/:videoId").get(getVideoComments).post(addComment);
commentRouter.route("/delete/:commentId").delete(deleteComment);
commentRouter.route("/update/:commentId").patch(updateComment);

export { commentRouter } 