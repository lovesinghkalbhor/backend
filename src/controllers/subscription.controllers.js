import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.models.js"
import { Subscription } from "../models/subscription.models.js"
import { ApiErrors } from "../utils/ApiErrors.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    // TODO: toggle subscription
    const { channelId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiErrors(401, "invalid channel id")
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiErrors(401, "invalid user id")
    }

    const findSubscription = await Subscription.findOneAndDelete({
        $and: [{ channel: channelId }, { subscriber: userId }]
    }, { new: true })


    if (findSubscription) {
        return res.status(200).json(
            new ApiResponse(201, { findSubscription }, "subscriber removed successfully")
        );
    } else {
        const newSubscriber = await Subscription.create({ subscriber: userId, channel: channelId });

        if (!newSubscriber) {
            throw new ApiErrors(500, "something went wrong can not add a subscriber")
        }

        return res.status(200).json(
            new ApiResponse(201, { newSubscriber }, "new subscriber added successfully")
        )
    }
})

// controller to return subscriber list of a channel
const getSubscribers = asyncHandler(async (req, res) => {
    const channelId = req.user._id;


    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiErrors(401, "invalid channel id")
    }

    const subscribers = await Subscription.find({ channel: channelId })


    if (!subscribers) {
        throw new ApiErrors(401, "invalid channel id, can not find subscribers")
    }

    return res.status(201).json(
        new ApiResponse(200, { subscribers, numberofsubscribers: subscribers?.length }, "Channel subscribers")

    )


})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const subscriberId = req.user._id;

    console.log(subscriberId);
    if (!mongoose.Types.ObjectId.isValid(subscriberId)) {

        throw new ApiErrors(401, "invalid subscriberId")
    }

    const subscribedChannels = await Subscription.find({ subscriber: subscriberId })


    if (!subscribedChannels) {
        throw new ApiErrors(401, "invalid user id, can not find Subscribed channels")
    }

    return res.status(201).json(
        new ApiResponse(200, { subscribedChannels, numberofchannels: subscribedChannels?.length }, "Subscribed Channels")

    )

})

export {
    toggleSubscription,
    getSubscribers,
    getSubscribedChannels
}