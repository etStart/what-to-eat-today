import imageCompression from "browser-image-compression";

import { appConfig } from "../lib/config";
import { supabase } from "../lib/supabase";

export async function compressRecipeImage(file: File) {
  return imageCompression(file, {
    maxWidthOrHeight: 1200,
    maxSizeMB: 0.5,
    useWebWorker: true,
    initialQuality: 0.82,
  });
}

export async function uploadRecipeImage(userId: string, file: File) {
  if (!supabase) {
    throw new Error("Supabase 还没有配置完成，暂时无法上传图片。");
  }

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(appConfig.storageBucket)
    .upload(path, file, {
      upsert: false,
      contentType: file.type || "image/jpeg",
    });

  if (error) {
    throw error;
  }

  return path;
}

export async function createSignedImageUrl(path: string) {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.storage
    .from(appConfig.storageBucket)
    .createSignedUrl(path, 60 * 60);

  if (error) {
    console.error(error);
    return null;
  }

  return data.signedUrl;
}
