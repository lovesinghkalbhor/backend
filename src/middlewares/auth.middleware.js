import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"
import { ApiErrors } from "../utils/ApiErrors.js"


// we can user underscore _ where we do not user "res" or any parameter
const verifyJWT = async (req, _, next) => {
    try {
        // Get token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");


        // Check if token is missing
        if (!token) {
            return next(new ApiErrors(401, "Unauthorized request: Token not found Please login"));
        }

        // Verify the JWT token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Check if the token is invalid
        if (!decodedToken) {
            return next(new ApiErrors(401, "Invalid Access Token"));
        }

        // Find user by ID from the decoded token
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        // If user is not found, throw an error
        if (!user) {
            return next(new ApiErrors(401, "Invalid Access Token: User not found"));
        }

        // Attach user to the request object
        req.user = user;

        // Proceed to the next middleware
        next();
    } catch (error) {
        // Pass the error to the next middleware for centralized error handling
        next(new ApiErrors(401, "Invalid access token"));
    }
};

export { verifyJWT };