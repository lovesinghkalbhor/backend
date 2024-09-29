

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { User } from "../models/user.models.js";
import { UploadFiles } from "../utils/cloudinaryUploadfiles.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
async function generteAccessAndRefreshToken(user) {
    try {
        const refreshToken = await user.generateRefreshToken();
        const accessToken = await user.generateAccessToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false })


        return { refreshToken, accessToken };
    }
    catch (error) {
        throw new ApiErrors(500, "Something went wrong while generating referesh and access token")
    }
}


const registerUser = asyncHandler(async (req, res) => {


    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const { userName, email, fullName, password } = req.body;

    if ([userName, email, fullName, password].some((field) => (field?.trim() === ""))) {
        throw ApiErrors(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (existedUser) {
        throw new ApiErrors(409, 'User already exists');
    }


    // extraction image data form body
    let avatarLoacalPath
    let coverImageLoacalPath

    // avatar image check
    if (Array.isArray(req.files?.avatar)) {
        avatarLoacalPath = await req.files?.avatar[0]?.path;
    } else {
        throw new ApiErrors(400, "Aavtar image is required")
    }

    // cover image check
    if (Array.isArray(req.files?.coverImage)) {
        coverImageLoacalPath = await req.files?.coverImage[0].path;
    }


    // uploading file to cloudinary
    const avatar = await UploadFiles(avatarLoacalPath)
    const coverImage = await UploadFiles(coverImageLoacalPath)

    if (!avatar) {
        throw new ApiErrors(400, "Avatar image not uploaded try again")
    }


    // adding data to database
    const user = await User.create({
        avatar: avatar?.url,
        coverImage: coverImage?.url || "",
        userName: userName.toLowerCase(),
        email,
        fullName,
        password,
    })


    // check if data is succesfully added to database  or not 
    const CreatedUser = await User.findById(user._id).select("-password -refreshToken")
    if (!CreatedUser) {
        throw new ApiErrors(500, "Something went wrong while registering the user")
    }

    // sending response to client
    return res.status(201).json(
        new ApiResponse(200, CreatedUser, "User registered Successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {

    // get user details from frontend
    // validation - not empty
    //check if user exist in db
    //  check if password is correct 
    // if correct generate access and refresh token 
    // return res


    const { email, userName, password } = req.body;

    // check for empty fields
    if (!(email || userName))
        throw new ApiErrors(400, "Please enter a valid email or userName ");

    if (!password)
        throw new ApiErrors(400, "Please enter password ");



    // check for available user
    const user = await User.findOne({
        $or: [{ email }, { userName }]
    })
    if (!user) {
        throw new ApiErrors(400, "User does not exist")
    }


    // check for password validation
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiErrors(400, "Password is incorrect")
    }


    // generating acces and refreshTOken
    const { refreshToken, accessToken } = await generteAccessAndRefreshToken(user);


    // filtering the password and refreshtoken form the object so it can be passed as response
    const userDataForSendingresponse = user._doc
    const userWithoutSensitiveData = Object.fromEntries(
        Object.entries(userDataForSendingresponse).filter(([key]) => key !== "password" && key !== "refreshToken")
    );


    // these are the options for sending secure cookies 
    const options = {
        httpOnly: true,
        secure: true
    }

    // response for secure cookies
    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options).json(
            new ApiResponse(200,
                {
                    user: userWithoutSensitiveData, refreshToken, accessToken
                }
                , "Login successfully")
        )

})


const logoutUser = asyncHandler(async (req, res) => {
    const user = req.user

    user.refreshToken = undefined

    await user.save({ validateBeforeSave: false })

    // these are the options for sending secure cookies 
    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, "User successfully loged"))

})


const revalidateRefressAndAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiErrors(401, "unauthorized request")

    }

    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id)

    if (!user) {
        throw new ApiErrors(401, "Invalid refresh token")
    }

    if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiErrors(401, "Refresh token is expired or used")

    }

    const options = {
        httpOnly: true,
        secure: true
    }

    const { refreshToken, accessToken } = await generteAccessAndRefreshToken(user)
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { accessToken, refreshToken: refreshToken },
                "Access token refreshed"
            )
        )
})


export { registerUser, loginUser, logoutUser, revalidateRefressAndAccessToken }