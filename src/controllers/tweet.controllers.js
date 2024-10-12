import mongoose, { isValidObjectId, Schema, ObjectId } from "mongoose"
import { Tweet } from "../models/tweet.models.js"
import { User } from "../models/user.models.js"
import { ApiErrors } from "../utils/ApiErrors.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { response } from "express"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

    // get user id
    // check if user id valid and not empty
    // get tweet form the body
    // destructure tweet 
    // check if tweet is valid and not empty
    // create tweet object form Schema
    // check if tweet created successfully else give error
    // send success response

    const user_id = req.user._id

    if (!user_id) {
        throw new ApiErrors(401, "invalid user, Can not add tweet")
    }


    const { tweet } = req.body

    if (!tweet?.trim()) {
        throw new ApiErrors(401, "Can not add empty tweet");
    }


    const createdTweet = await Tweet.create({
        content: tweet,
        owner: user_id
    })

    if (!createdTweet) {
        throw new ApiErrors(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdTweet, "Tweet uploaded successfully")
    )

})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    //  get user Id
    //  check if user id valid and not empty 
    //  find the tweet by owner id 
    //  check if tweet found else give error
    //  send success response




    const user_id = req.params.userId;

    if (!user_id?.trim()) {
        throw new ApiErrors(401, "invalid user, Can not add tweet")
    }


    const userTweets = await Tweet.find({ owner: user_id })

    if (!userTweets) {
        throw new ApiErrors(400, "no tweets found for current user")
    }

    return res.status(201).json(
        new ApiResponse(200, userTweets, "user tweets")
    )

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet

    //  get user Id
    //  check if user id valid and not empty 
    // get tweet id form body 
    // get tweet content from body
    // find tweet by id and update
    //  send success response




    const tweet_id = req.params.tweetId;
    const tweetObjectId = new mongoose.Types.ObjectId(tweet_id)
    const tweet = req.body.tweet;


    if (!mongoose.Types.ObjectId.isValid(tweet_id)) {
        throw new ApiErrors(401, "Invalid tweet ID");
    }


    console.log(mongoose.Types.ObjectId.isValid(tweet_id))
    const updatedTweet = await Tweet.findOneAndUpdate(
        { _id: tweetObjectId },
        { $set: { content: tweet } }, // Modify the "content" field
        { new: true }// Use 'returnDocument' option to get the updated document (new in Mongoose 6+)
    );

    if (!updatedTweet) {
        throw new ApiErrors(400, "No document found with the specified ID,cannot update the tweet")
    }

    return res.status(201).json(
        new ApiResponse(200, { tweet: updatedTweet.content }, "tweet updated successfully")
    )


})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    //  get user Id
    //  check if user id valid and not empty 
    // get tweet id form body 
    // delete tweet
    //  send success response



    const tweet_id = req.params.tweetId;
    const tweetObjectId = new mongoose.Types.ObjectId(tweet_id)


    if (!mongoose.Types.ObjectId.isValid(tweet_id)) {
        throw new ApiErrors(401, "Invalid tweet ID");
    }


    console.log(mongoose.Types.ObjectId.isValid(tweet_id))
    const deletedTweet = await Tweet.findOneAndDelete(
        { _id: tweetObjectId }, // Modify the "content" field
        {
            projection: {
                owner: 0,
            }
        }
    )

    if (!deletedTweet) {
        throw new ApiErrors(400, "No document found with the specified ID,cannot delete the tweet")
    }

    return res.status(201).json(
        new ApiResponse(200, { deletedTweet }, "tweet deleted successfully")
    )


})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}