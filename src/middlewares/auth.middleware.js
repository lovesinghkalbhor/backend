import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"
import { ApiErrors } from "../utils/ApiErrors.js"


// we can user underscore _ where we do not user "res" or any parameter
const verifyJWT = async (req, _, next) => {

    // take jwt from the request
    // check if token exist
    // verifyJWT 
    // find the data form the database

    try {

        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiErrors(401, "Unauthorized request")

        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {

            throw new ApiErrors(401, "Invalid Access Token")
        }

        req.user = user;
        next()
    } catch (error) {
        throw new ApiErrors(401, error?.message || "Invalid access token")
    }


}

export { verifyJWT }