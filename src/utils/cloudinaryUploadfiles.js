import fs from "fs";
import { v2 as cloudinary } from 'cloudinary';


// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDNARY_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});
export async function UploadFiles(localFilePath) {



    try {
        if (!localFilePath) return "path not found";
        // Upload an image
        const uploadResult = await cloudinary.uploader
            .upload(
                localFilePath, {
                resource_type: "auto"
            })

        // console.log(uploadResult, "file uploaded successfully");
        fs.unlinkSync(localFilePath);
        return uploadResult;

    } catch (error) {
        fs.unlinkSync(localFilePath);
        return error
    }
    // Optimize delivery by resizing and applying auto-format and auto-quality


};