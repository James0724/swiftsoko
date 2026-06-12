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

const PRODUCT_IMAGES_FOLDER = "product-images";

export async function uploadProductImage(
  file: File
): Promise<{ publicId: string; url: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: PRODUCT_IMAGES_FOLDER,
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
  });
}

export async function deleteProductImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export async function deleteProductImages(publicIds: string[]): Promise<void> {
  if (!publicIds.length) return;
  await Promise.allSettled(publicIds.map(deleteProductImage));
}

/** Extracts the Cloudinary public_id from a secure_url. */
export function extractPublicId(url: string): string {
  // e.g. https://res.cloudinary.com/demo/image/upload/v1234/product-images/abc.jpg
  // → product-images/abc
  const parts = url.split("/upload/");
  if (parts.length < 2) return "";
  const afterUpload = parts[1].replace(/^v\d+\//, "");
  return afterUpload.replace(/\.[^/.]+$/, "");
}

export { cloudinary };
