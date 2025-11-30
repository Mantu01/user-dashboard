import {Readable} from 'stream';
import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type UploadOptions = {
  folder: string
  resource_type?: 'image' | 'video' | 'auto'
}

export const uploadToCloudinary = async (buffer: Buffer,options: UploadOptions) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `dashboard/${options.folder}`,
        resource_type: options.resource_type || 'auto',
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )

    const stream = Readable.from(buffer)
    stream.pipe(uploadStream)
  })
}