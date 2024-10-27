import mongoose from "mongoose"
import { Video } from "../models/video.models.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiErrors } from "../utils/ApiErrors.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    // get the user id form the requset
    // get all the video that is uploaded by user
    // now add the aggregation pipeline for getting total number of views on channel 

    const { channelId } = req.params;
    console.log(channelId);

    const channelStats = await Video.aggregate([

        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelId),
            }
        },

        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likesDetails",
            },
        },
        {
            $addFields: {
                likedCount: {
                    $size: "$likesDetails",
                },
            },
        },


        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "video",
                as: "comments",
            },
        },
        {
            $addFields: {
                commentCount: {
                    $size: "$comments",
                },
            },
        },


        {
            $group: {
                _id: "$owner",
                Totalvideos: {
                    $sum: 1,
                },
                Totalviews: {
                    $sum: "$views",
                },
                Totalcomment: {
                    $sum: "$commentCount",
                },
            },
        },


        {
            $lookup: {
                from: "tweets",
                localField: "_id",
                foreignField: "owner",
                as: "tweet",
            },
        },
        {
            $addFields: {
                tweetCount: {
                    $size: "$tweet",
                },
            },
        },

        // add subscriber in final document
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscriber",
            },
        },
        // count the subscriber count form the subscriber array
        {
            $addFields: {
                subscriberCount: {
                    $size: "$subscriber",
                },
            },
        },


        //   add playlist in the final document
        {
            $lookup: {
                from: "playlists",
                localField: "_id",
                foreignField: "owner",
                as: "playlists",
            },
        },

        // count the playlist using playlists array and add new field
        {
            $addFields: {
                playlistCount: {
                    $size: "$playlists",

                },
            },
        },


        // project final data
        {
            $project: {
                playlists: 0,
                subscriber: 0,
                tweet: 0
            }
        }

    ])

    if (!channelStats) {

        throw new ApiErrors(500, "internal server error")

    }

    return res.status(200).json(
        new ApiResponse(201, { channelStats }, "ChannelStats fetched successfully")
    )


})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    // take user id fom req
    // find all the video where owner is equal to user 
    // now you have all the videos that is uploaded by channel

    const channelId = req.params.channelId;

    const channelVideo = await Video.find({ owner: new mongoose.Types.ObjectId(channelId) })

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