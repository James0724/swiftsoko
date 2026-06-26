import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName) {
  throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set in environment variables");
}
if (!apiKey) {
  throw new Error("NEXT_PUBLIC_CLOUDINARY_API_KEY is not set in environment variables");
}
if (!apiSecret) {
  throw new Error("CLOUDINARY_API_SECRET is not set in environment variables");
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

const PRODUCT_IMAGES_FOLDER = "products";
const PRODUCT_CONTENT_IMAGES_FOLDER = "product-content";

function uploadImageToFolder(
  file: File,
  folder: string
): Promise<{ publicId: string; url: string }> {
  return file.arrayBuffer().then(
    (arrayBuffer) =>
      new Promise((resolve, reject) => {
        const buffer = Buffer.from(arrayBuffer);
        cloudinary.uploader
          .upload_stream(
            {
              folder,
              resource_type: "image",
              unique_filename: true,
              overwrite: false,
            },
            (error, result) => {
              if (error || !result) {
                return reject(error ?? new Error("Cloudinary upload failed"));
              }
              resolve({ publicId: result.public_id, url: result.secure_url });
            }
          )
          .end(buffer);
      })
  );
}

export function uploadProductImage(
  file: File
): Promise<{ publicId: string; url: string }> {
  return uploadImageToFolder(file, PRODUCT_IMAGES_FOLDER);
}

export function uploadContentImage(
  file: File
): Promise<{ publicId: string; url: string }> {
  return uploadImageToFolder(file, PRODUCT_CONTENT_IMAGES_FOLDER);
}

export async function deleteProductImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export async function deleteProductImages(publicIds: string[]): Promise<void> {
  if (!publicIds.length) return;
  await Promise.allSettled(publicIds.map(deleteProductImage));
}

export { cloudinary };
