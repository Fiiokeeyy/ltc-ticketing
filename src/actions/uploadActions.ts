"use server";

import { v2 as cloudinary } from "cloudinary";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { eq } from "drizzle-orm";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Validate Cloudinary configuration
function validateCloudinaryConfig() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error(
      "Cloudinary configuration is missing. Please check your environment variables.",
    );
  }
}

/**
 * Upload payment proof to Cloudinary and update transaction
 * @param formData - FormData containing the file
 * @param orderId - Transaction order ID
 * @returns Object with success status and message/URL
 */
export async function uploadPaymentProof(formData: FormData, orderId: string) {
  try {
    // Validate configuration
    validateCloudinaryConfig();

    // Get file from FormData
    const file = formData.get("file") as File;

    if (!file) {
      return {
        success: false,
        error: "No file provided",
      };
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        success: false,
        error: "File size exceeds 5MB limit",
      };
    }

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    if (!validTypes.includes(file.type)) {
      return {
        success: false,
        error: "Invalid file type. Only JPG, PNG, and PDF are allowed",
      };
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using upload_stream with Promise
    const uploadResult = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "ltc-ticketing/payment-proofs",
            resource_type: "auto", // Handles both images and PDFs
            public_id: `proof-${orderId}-${Date.now()}`,
            transformation: [
              { width: 1200, height: 1600, crop: "limit" }, // Limit size
              { quality: "auto" }, // Auto quality
            ],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve(result);
            } else {
              reject(new Error("Upload failed without error"));
            }
          },
        );

        // Write buffer to stream
        uploadStream.end(buffer);
      },
    );

    // Update transaction in database
    await db
      .update(transactions)
      .set({
        paymentProofUrl: uploadResult.secure_url,
        status: "pending_verification",
      })
      .where(eq(transactions.id, orderId));

    return {
      success: true,
      url: uploadResult.secure_url,
      message: "Payment proof uploaded successfully",
    };
  } catch (error) {
    console.error("Error uploading payment proof:", error);

    // Handle specific error messages
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to upload payment proof. Please try again.",
    };
  }
}

/**
 * Upload QRIS image to Cloudinary
 * @param formData - FormData containing the file
 * @returns Object with success status and message/URL
 */
export async function uploadQrisImage(formData: FormData) {
  try {
    // Validate configuration
    validateCloudinaryConfig();

    // Get file from FormData
    const file = formData.get("file") as File;

    if (!file) {
      return {
        success: false,
        error: "No file provided",
      };
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        success: false,
        error: "File size exceeds 5MB limit",
      };
    }

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    if (!validTypes.includes(file.type)) {
      return {
        success: false,
        error: "Invalid file type. Only JPG, and PNG are allowed",
      };
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using upload_stream with Promise
    const uploadResult = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "ltc-ticketing/qris",
            resource_type: "image", 
            public_id: `qris-${Date.now()}`,
            transformation: [
              { width: 800, height: 800, crop: "limit" }, // Limit size
              { quality: "auto" }, // Auto quality
            ],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve(result);
            } else {
              reject(new Error("Upload failed without error"));
            }
          },
        );

        // Write buffer to stream
        uploadStream.end(buffer);
      },
    );

    return {
      success: true,
      url: uploadResult.secure_url,
      message: "QRIS image uploaded successfully",
    };
  } catch (error) {
    console.error("Error uploading QRIS image:", error);

    // Handle specific error messages
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to upload QRIS image. Please try again.",
    };
  }
}

/**
 * Upload event poster image to Cloudinary
 * @param formData - FormData containing the file
 * @returns Object with success status and message/URL
 */
export async function uploadPosterImage(formData: FormData) {
  try {
    // Validate configuration
    validateCloudinaryConfig();

    // Get file from FormData
    const file = formData.get("file") as File;

    if (!file) {
      return {
        success: false,
        error: "No file provided",
      };
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        success: false,
        error: "File size exceeds 5MB limit",
      };
    }

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    if (!validTypes.includes(file.type)) {
      return {
        success: false,
        error: "Invalid file type. Only JPG, and PNG are allowed",
      };
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using upload_stream with Promise
    const uploadResult = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "ltc-ticketing/posters",
            resource_type: "image", 
            public_id: `poster-${Date.now()}`,
            transformation: [
              { width: 1200, height: 1600, crop: "limit" }, // Limit size
              { quality: "auto" }, // Auto quality
            ],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve(result);
            } else {
              reject(new Error("Upload failed without error"));
            }
          },
        );

        // Write buffer to stream
        uploadStream.end(buffer);
      },
    );

    return {
      success: true,
      url: uploadResult.secure_url,
      message: "Poster image uploaded successfully",
    };
  } catch (error) {
    console.error("Error uploading Poster image:", error);

    // Handle specific error messages
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to upload Poster image. Please try again.",
    };
  }
}

