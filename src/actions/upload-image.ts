"use server";

import { Storage } from "@google-cloud/storage";

// ============================================================
// Google Cloud Storage — Upload gambar makanan
// ============================================================

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL!,
    private_key: process.env.GCP_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  },
});

const bucket = storage.bucket(process.env.GCP_BUCKET_NAME!);

/** Format file yang diperbolehkan */
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
/** Ukuran maks file: 5 MB */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Upload gambar makanan ke GCP Cloud Storage.
 *
 * @param formData – FormData berisi file gambar (key: `"file"`)
 * @param slug     – Slug / identifier untuk penamaan file
 * @returns URL publik gambar yang di‑upload
 */
export async function uploadFoodImage(
  formData: FormData,
  slug: string,
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const file = formData.get("file") as File | null;

    if (!file || file.size === 0) {
      return { success: false, error: "Tidak ada file yang dipilih." };
    }

    // --- validasi tipe ---
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        success: false,
        error: "Format file tidak didukung. Gunakan JPEG, PNG, atau WebP.",
      };
    }

    // --- validasi ukuran ---
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: "Ukuran file terlalu besar. Maksimal 5 MB.",
      };
    }

    // --- generate nama unik ---
    const ext = file.name.split(".").pop() || "jpg";
    const safeName = slug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");
    const fileName = `food-images/${safeName}-${Date.now()}.${ext}`;

    // --- upload ke GCS ---
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const blob = bucket.file(fileName);
    await blob.save(buffer, {
      metadata: {
        contentType: file.type,
        cacheControl: "public, max-age=31536000",
      },
    });

    // Dengan Uniform Bucket-Level Access (UBLA), tidak bisa menggunakan
    // object-level ACL (makePublic). Akses publik dikontrol melalui IAM
    // di level bucket (allUsers → Storage Object Viewer).
    // URL publik tetap bisa dibentuk langsung:
    const publicUrl = `https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/${fileName}`;

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("Error uploading to GCS:", error);
    return {
      success: false,
      error: "Gagal mengupload gambar: " + (error as Error).message,
    };
  }
}

/**
 * Hapus gambar dari GCS bucket berdasarkan URL publik.
 */
export async function deleteFoodImage(
  imageUrl: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const bucketName = process.env.GCP_BUCKET_NAME!;
    const prefix = `https://storage.googleapis.com/${bucketName}/`;

    if (!imageUrl.startsWith(prefix)) {
      return { success: false, error: "URL bukan dari GCS bucket ini." };
    }

    const fileName = imageUrl.replace(prefix, "");
    await bucket.file(fileName).delete();

    return { success: true };
  } catch (error) {
    console.error("Error deleting from GCS:", error);
    return {
      success: false,
      error: "Gagal menghapus gambar: " + (error as Error).message,
    };
  }
}
