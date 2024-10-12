import { v2 as cloudinary } from 'cloudinary';
import { ApiErrors } from "./ApiErrors.js";


// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDNARY_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});
export async function deleteCloudinaryImage(imageUrl) {


    try {
        const parts = imageUrl.split('/');
        const publicIdWithExtension = parts[parts.length - 1];  // e.g. "sample.jpg"

        // Remove the file extension (e.g., ".jpg")
        const publicId = publicIdWithExtension.split('.')[0];  // "sample"


        console.log(publicId, "id form deletefunction")

        if (!imageUrl) return "path not found";
        // Upload an image
        const uploadResult = await cloudinary.uploader
            .destroy(
                publicId, { invalidate: true })


        return uploadResult;

    } catch (error) {
        throw new ApiErrors(400, "something Went wrong while deleting image from cloudinary")

    }
    // Optimize delivery by resizing and applying auto-format and auto-quality


};