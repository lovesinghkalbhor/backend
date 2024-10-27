import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.models.js"
import { User } from "../models/user.models.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiErrors } from "../utils/ApiErrors.js"
import { UploadFiles } from "../utils/cloudinaryUploadfiles.js"
import { deleteCloudinaryImage } from "../utils/cloudinaryDeleteFile.js"


function escapeRegex(text) {
    const str = text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

    const regex = new RegExp(str, "gi");
    return regex;

}
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, } = req.query;


    // allowed values for sortBy and sortType are "views", "-views", "createdAt", "-createdAt","duration", "-duration" 

    console.log(query, sortBy, sortType,);
    // Validate userId
    // if (!userId) {
    //     return res.status(400).json({ error: "User ID is required" });
    // }
    const sort = parseInt(sortType, 10);
    const regexResult = escapeRegex(query);
    const pipeline = [{

        $match: {

            $or: [

                { title: { $regex: regexResult } },
                { descreption: { $regex: regexResult } }

            ]

        }

    },

    ];


    if (sortBy !== undefined) {
        pipeline.push({ $sort: { [sortBy]: sort } });
    }
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };

    const video = await Video.aggregate(pipeline).skip((options.page - 1) * options.limit).limit(options.limit);
    // const video = await Video.find({
    //     descreption: regexResult
    // })


    if (!video) {
        throw new ApiErrors(500, "Internal error: video cannot be fetched");
    }


    return res.status(200).json(new ApiResponse(201, { video }, 'Video fetched successfully'));


});

const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video

    // destructure title and description form the body
    // check if its not empty, if it is then show error
    // extract video and thumbnail file form the file 
    // check if its not empty, if it is then show error
    // upload video and thumbnail file to cloudinary
    // check if uploaded succesfully else show error
    // if uploaded succesfully then store the url in variables
    // now create a entry in databse
    // if entry  not added succesfully then send the error message 
    // send the response back to client,

    const { title, description } = req.body
    const userId = req.user._id

    // check if user id is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiErrors(401, "Invalid user ID");

    }

    // check title and description are not empty
    if ([title, description].some((field) => field.trim() === "")) {
        throw ApiErrors(400, "title and description are required")
    }


    let videoLoacalPath, thumbnailLocalPath

    // video check
    if (Array.isArray(req.files?.videoFile)) {
        videoLoacalPath = await req.files?.videoFile[0]?.path;
    } else {
        throw new ApiErrors(400, "video is required")
    }


    // thumbnail check
    if (Array.isArray(req.files?.thumbnail)) {
        thumbnailLocalPath = await req.files?.thumbnail[0]?.path;
    } else {
        throw new ApiErrors(400, "thumbnail is required")
    }


    // uploading files to cloudinary
    const uploadedVideoUrl = await UploadFiles(videoLoacalPath)
    const uploadedThumbnail = await UploadFiles(thumbnailLocalPath)


    // check if video and thumbnail uploaded successfully on cloudinary
    if (!uploadedVideoUrl && uploadedThumbnail) {
        throw new ApiErrors(400, "video or thumbnail not uploaded successfully, try again ")
    }

    // creating entry in database
    const video = await Video.create({
        videoFile: uploadedVideoUrl?.url,
        thumbnail: uploadedThumbnail?.url,
        owner: userId,
        title: title,
        descreption: description,

    })

    // if video is not uploaded succesfully then throw 
    if (!video) {
        throw new ApiErrors(500, "Something went wrong video not upload ")
    }

    return res.status(200).json(
        new ApiResponse(201, { video }, "Video successfully uploaded")
    )


})

const getVideoById = asyncHandler(async (req, res) => {
    //TODO: get video by id

    // get video id from params
    // check if video id correct or video id is not empty
    // find the video by id in database
    // throw error if not found
    // retrun the video data

    const { videoId } = req.params

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiErrors(400, "Invalid videoId")
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiErrors(400, "video does not exist");

    }

    return res.status(200).json(
        new ApiResponse(201, { video }, "Video found")
    );






})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail



    const { title, description } = req.body
    const userId = req.user._id

    // check if user id is valid
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiErrors(401, "Invalid video Id");

    }

    // check title and description are not empty
    if ([title, description].some((field) => field.trim() === "")) {
        throw ApiErrors(400, "title and description are required")
    }


    let thumbnailLocalPath


    // thumbnail check
    if (req?.file) {
        thumbnailLocalPath = await req.file?.path;
    } else {
        throw new ApiErrors(400, "thumbnail is required")
    }


    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiErrors(400, "video does not exist")
    }

    // before updating the thumbnail delete it first form the server
    const deletedThumbnail = await deleteCloudinaryImage(video?.thumbnail);


    // uploading files to cloudinary
    const uploadedThumbnail = await UploadFiles(thumbnailLocalPath)


    // check if video and thumbnail uploaded successfully on cloudinary
    if (!uploadedThumbnail) {
        throw new ApiErrors(400, "thumbnail not uploaded successfully, try again ")
    }

    const updateVideo = await Video.findByIdAndUpdate({
        _id: new mongoose.Types.ObjectId(videoId)
    },

        {
            title, descreption: description,
            thumbnail: uploadedThumbnail.url
        },
        { returnDocument: 'after' }  // Option to return the updated document

    )


    return res.status(200).json(
        new ApiResponse(201, { updateVideo }, "Video updated successfully")
    );






})

const deleteVideo = asyncHandler(async (req, res) => {
    //TODO: delete video

    // get video id from params
    // check if video id correct or video id is not empty
    // find the video by id in database
    // throw error if not found
    // retrun the video data

    const { videoId } = req.params

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiErrors(400, "Invalid videoId")
    }

    const video = await Video.findByIdAndDelete(videoId);

    if (!video) {
        throw new ApiErrors(400, "video does not exist");
    } else {
        const deletedVideo = deleteCloudinaryImage(video?.videoFile)
        const deletedThumbnail = deleteCloudinaryImage(video?.thumbnail)

        if (!deletedVideo) {
            throw new ApiErrors(400, 'video not deleted form server, video url deleted form database')

        }
        if (!deletedThumbnail) {
            throw new ApiErrors(400, 'Thumbnail not deleted form server, thumbnail url deleted form database')

        }
    }

    return res.status(200).json(
        new ApiResponse(201, { video }, "Video Deleted successfully")
    );




})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiErrors(400, "Invalid videoId")
    }

    const video = await Video.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(videoId) },  // Match by _id
        [{
            $set:
            {
                isPublished:
                {
                    $cond:
                    {
                        if: "$isPublished",
                        then: false,
                        else: true
                    }
                }
            }
        },

        ], { new: true }).select("-owner -thumbnail -videoFile -views -title -descreption")


    if (!video) {
        throw new ApiErrors(400, "can not publish/unpublish the video, try again");
    }

    return res.status(200).json(
        new ApiResponse(201, { video }, "publish/unpublish the video successfully")
    );


})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}