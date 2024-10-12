import { Router } from "express"
import {
    changeCurrentPassword,
    currentUser,
    loginUser,
    logoutUser,
    registerUser,
    revalidateRefressAndAccessToken,
    updateAvatar,
    updateCoverImage,
    getUserChannelProfile,
    watchHistory
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multerFileUpload.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

// user routes
userRouter.route("/register").post(upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]),
    registerUser)
userRouter.route("/login").post(loginUser)
userRouter.route("/logout").post(verifyJWT, logoutUser)
userRouter.route("/revalidate-refreshandaccesstoken").post(revalidateRefressAndAccessToken)
userRouter.route("/changepassword").post(verifyJWT, changeCurrentPassword)
userRouter.route("/currentuser").get(verifyJWT, currentUser)
userRouter.route("/updateavatar").patch(verifyJWT, upload.single("avatar"), updateAvatar)
userRouter.route("/updateCoverImage").patch(verifyJWT, upload.single("coverImage"), updateCoverImage)
userRouter.route("/channeldetail/:userName").get(verifyJWT, getUserChannelProfile)
userRouter.route("/watchHistory/:userName").get(verifyJWT, watchHistory)

export { userRouter } 