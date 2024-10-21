import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.models.js"
import { ApiErrors } from "../utils/ApiErrors.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.models.js"
import { Tweet } from "../models/tweet.models.js"
import { Comment } from "../models/comment.models.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on video

    // get the video id form the params 
    // check if video id is correct else show error
    // find the video in the database, else show error
    // check in the likeSchema database with the user id if liked schema already created
    // if created, check the video has id, if it has id then remove it else add one    
    // if not created, create schema and add user id and video id, and give error if can not create

    // send the response


    const { videoId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiErrors(400, 'invalid video id')
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiErrors(400, 'video not found')
    }

    const likedVideo = await Like.findOne({ likedBy: userId });

    if (likedVideo) {

        if (likedVideo.video) {
            likedVideo.video = null;

            await likedVideo.save()

            return res.status(200).json(
                new ApiResponse(201, { likedVideo }, "video disliked successfully")
            )
        }
        else {
            likedVideo.video = videoId
            await likedVideo.save()

            return res.status(200).json(
                new ApiResponse(201, { likedVideo }, "video liked successfully")
            )
        }



    }


    const createdLikedEntery = await Like.create({
        likedBy: userId,
        video: videoId
    });

    if (!createdLikedEntery) {
        throw new ApiErrors(500, "There was an error, likind the video")
    }

    return res.status(200).json(
        new ApiResponse(201, { createdLikedEntery }, "video liked successfully")
    )




})

const toggleCommentLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on comment
    const { commentId } = req.params;

    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiErrors(400, 'invalid comment id')
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiErrors(400, 'comment not found')
    }

    const likedComment = await Like.findOne({ likedBy: userId });

    if (likedComment) {

        if (likedComment.comment) {
            likedComment.comment = null;

            await likedComment.save()

            return res.status(200).json(
                new ApiResponse(201, { likedComment }, "comment disliked successfully")
            )
        }
        else {
            likedComment.comment = commentId
            await likedComment.save()

            return res.status(200).json(
                new ApiResponse(201, { likedComment }, "comment liked successfully")
            )
        }



    }


    const createdCommentEntery = await Like.create({
        likedBy: userId,
        comment: commentId
    });

    if (!createdCommentEntery) {
        throw new ApiErrors(500, "There was an error, likind the video")
    }

    return res.status(200).json(
        new ApiResponse(201, { createdCommentEntery }, "video liked successfully")
    )




})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    //TODO: toggle like on tweet



    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiErrors(400, 'invalid tweet id')
    }

    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new ApiErrors(400, 'comment not found')
    }

    const likedTweet = await Like.findOne({ likedBy: userId });

    if (likedTweet) {

        if (likedTweet.tweet) {
            likedTweet.tweet = null;

            await likedTweet.save()

            return res.status(200).json(
                new ApiResponse(201, { likedTweet }, "tweet disliked successfully")
            )
        }
        else {
            likedTweet.tweet = tweetId
            await likedTweet.save()

            return res.status(200).json(
                new ApiResponse(201, { likedTweet }, "tweet liked successfully")
            )
        }



    }


    const createdTweetEntery = await Like.create({
        likedBy: userId,
        tweet: tweetId
    });

    if (!createdTweetEntery) {
        throw new ApiErrors(500, "There was an error, liking the tweet")
    }

    return res.status(200).json(
        new ApiResponse(201, { createdTweetEntery }, "tweet liked successfully")
    )



}
);

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    //     get user id form req

    //     using pipeline

    //    get all the doc form the like schema where user is present 
    //    then filter this doc such that it should only have object where video has id

    //    now you have all the videos that is liked by the user
    //    check if the returned array is not empty if its then show message no liked video found

    //    now return the response object


    const userid = req.user._id;

    const likedVideo = await Like.aggregate([
        {
            $match: {
                likedBy: userid, video: { $exists: true, $ne: null } // Ensures 'video' field is not null
            }


        },
        {
            $project: {
                comment: 0,
                tweet: 0 // Exclude other fields if not needed
            }
        }
    ])


    if (!likedVideo?.length) {
        throw new ApiErrors(400, "no liked video found")

    }

    return res.status(200).json(
        new ApiResponse(201, { likedVideo }, 'video liked by user')
    )


});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}