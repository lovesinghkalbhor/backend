import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.models.js"
import { ApiErrors } from "../utils/ApiErrors.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { response } from "express"


const createPlaylist = asyncHandler(async (req, res) => {

    //TODO: create playlist

    // extract name and description form the body
    // check if its not empty else give error
    // check if user is valid, else give error
    // store user in variable
    // now create a new Playlist form in database
    // check if its created successfully else give error
    // send response




    const { name, description } = req.body
    const userid = req.user._id;

    if ([name, description].some((field) => (field?.trim() === ""))) {
        throw new ApiErrors(400, "name and description are required")
    }

    if (!userid) {
        throw new ApiErrors(400, "userid is required")
    }


    const playlist = await Playlist.create({
        name, description, owner: mongoose.Types.ObjectId(userid),
    })

    if (!playlist) {
        throw new ApiErrors(500, "Internal error playlist not created in database")

    }

    return res.status(200).json(
        new ApiResponse(200, { playlist }, 'Playlist created successfully')
    );




})

const getUserPlaylists = asyncHandler(async (req, res) => {
    //TODO: get user playlists

    // extract user id form params
    // check if user id is valid else show error
    // find the playlist of the user by id 
    // check if playlist found else show error
    // send response

    const { userId } = req.params

    if (!userId) {
        throw new ApiErrors(400, "userid is required")
    }



    const playlist = await Playlist.find({ owner: userId });


    if (!playlist) {
        throw new ApiErrors(400, "playlist not found")
    }

    res.status(200).json(
        new ApiResponse(201, { playlist }, "playlist found")
    )



})

const getPlaylistById = asyncHandler(async (req, res) => {
    //TODO: get playlist by id

    // extract playlist id form params
    // check if playlist id is valid else show error
    // find the playlist of the user by id 
    // check if playlist found else show error
    // send response



    const { playlistId } = req.params



    if (!playlistId) {
        throw new ApiErrors(400, "playlistId is required")
    }



    const playlist = await Playlist.findById(playlistId);


    if (!playlist) {
        throw new ApiErrors(400, "playlist not found")
    }

    res.status(200).json(
        new ApiResponse(201, { playlist }, "playlist found")
    )

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {


    // extract playlist and video id form params
    // check if playlist and video id is valid and else show error
    // now add the video to the playlist else show error
    // send response



    const { playlistId, videoId } = req.params



    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiErrors(400, "playlistId is not valid")
    }

    if (!!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiErrors(400, "videoId is not valid")
    }

    const addedVideo = await Playlist.findById(playlistId);
    addedVideo?.videos.push(videoId);

    if (!addedVideo) {
        throw new Error("Playlist not found");
    }

    await addedVideo.save()


    res.status(200).json(
        new ApiResponse(201, { addedVideo }, "video added successfully")
    )


})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    // TODO: remove video from playlist

    // extract playlist and video id form params
    // check if playlist and video id is valid and else show error
    // now find the video in the playlist and give error if not found
    // if found then delete else give error
    // send response


    const { playlistId, videoId } = req.params






    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiErrors(400, "playlistId is not valid")
    }

    if (!!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiErrors(400, "videoId is not valid")
    }

    const addedVideo = await Playlist.findById(playlistId);
    addedVideo?.videos.pull(videoId);

    if (!addedVideo) {
        throw new Error("Playlist not found");
    }

    await addedVideo.save()


    res.status(200).json(
        new ApiResponse(201, { addedVideo }, "video added successfully")
    )

})

const deletePlaylist = asyncHandler(async (req, res) => {
    // TODO: delete playlist


    // extract playlist id form params
    // check if playlist id is valid else show error
    // find the playlist of the user by id 
    // check if playlist found else show error
    // if found then delete playlist else show error
    // send response



    const { playlistId } = req.params


    if (!playlistId) {
        throw new ApiErrors(400, "playlistId is required")
    }


    const playlist = await Playlist.findByIdAndDelete(playlistId);


    if (!playlist) {
        throw new ApiErrors(400, "playlist not found")
    }

    res.status(200).json(
        new ApiResponse(201, { playlist }, "playlist deleted successfully")
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    //TODO: update playlist

    // extract playlist id form params
    //  extract name and description form the body
    // show error if fields are empty
    // check if playlist id is valid else show error
    // now update the playlist data
    // show error if playlist is not updated
    // send response

    const { playlistId } = req.params
    const { name, description } = req.body


    if ([name, description].some((field) => (field?.trim() === ""))) {
        throw new ApiErrors(400, "name and description are required")
    }

    if (!playlistId) {
        throw new ApiErrors(400, "playlistId is required")
    }


    const playlist = await Playlist.findByIdAndUpdate(playlistId, {
        $set: { name, description }
    })

    if (!playlist) {
        throw new ApiErrors(500, "Internal error playlist not updated in database")
    }

    return res.status(200).json(
        new ApiResponse(200, { playlist }, 'Playlist updated successfully')
    );



})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}