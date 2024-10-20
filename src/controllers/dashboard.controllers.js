import mongoose from "mongoose"
import { Video } from "../models/video.models.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiErrors } from "../utils/ApiErrors.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    // get the user id form the requset
    // get all the video that is uploaded by user
    // now add the aggregation pipeline for getting total number of views on channel 





})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    // take user id fom req
    // find all the video where owner is equal to user 
    // now you have all the videos that is uploaded by channel

    const userid = req.user._id;

    const channelVideo = await Video.find({ owner: userid })

    if (!channelVideo.length) {
        throw new ApiErrors(400, "now video found")
    }

    res.status(200).json(
        new ApiResponse(201, { channelVideo }, "All the videos by channel")
    )





})

export {
    getChannelStats,
    getChannelVideos
}