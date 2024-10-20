import mongoose from "mongoose"
import { Comment } from "../models/comment.models.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiErrors } from "../utils/ApiErrors.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video

    // take user id form the request
    // check if the user exist else show error
    // take the comment form the body
    // check if the comment is not empty else show error
    // take a video id form the params 
    // check if the video is valid else show error
    // create a entry in database for comment

    // if entry is not created then show error

    // send the response


    const { videoId } = req.params;
    const userid = req.user?._id;
    const comment = req.body.comment;


    if (!userid) {
        throw new ApiErrors(400, "user id not provided");
    }

    if (!comment.trim() === "") {
        throw new ApiErrors(400, "comment is empty");
    }

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiErrors(400, "video id is not valid");
    }


    const comments = await Comment.create({
        content: comment,
        video: videoId,
        owner: userid
    })

    if (!comments) {
        throw new ApiErrors(500, "internal error can not create comment")

    }

    return res.status(200).json(
        new ApiResponse(201, { comments }, "comment added successfully")
    );



})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment


    // take a comment id form the params 
    // check if the commentid is valid else show error
    // take the comment form the body
    // check if the comment is not empty else show error

    // update a comment in database for comment
    // if not updated show error

    // send the response


    const commentId = req.params.commentId;

    const comment = req.body.comment;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiErrors(400, 'invalid comment id')
    }

    if (!comment.trim() === "") {
        throw new ApiErrors(400, "comment is empty");
    }


    const updatedComment = await Comment.findByIdAndUpdate(commentId, {
        content: comment
    }, { new: true });


    if (!updatedComment) {
        throw new ApiErrors(500, 'internal error comment cannot be updated')
    }


    return res.status(200).json(
        new ApiResponse(201, { updatedComment }, 'Comment updated')
    );

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    // take a comment id form the params 
    // check if the commentid is valid else show error

    // find the comment by id and delete
    // if comment is not deleted then show error 

    // send the response




    const commentId = req.params.commentId;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiErrors(400, 'invalid comment id')
    }




    const deleteComment = await Comment.findByIdAndDelete(commentId, {
    }, { new: true });


    if (!deleteComment) {
        throw new ApiErrors(500, 'internal error comment cannot be deleted')
    }


    return res.status(200).json(
        new ApiResponse(201, { deleteComment }, 'Comment deleted successfully')
    );


})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}