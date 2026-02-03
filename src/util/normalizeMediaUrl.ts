import { API_BASE_URL } from "../api/axios";

export const normalizeMediaUrl = (url?: string): string => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("res.cloudinary")) return `https://${url}`;

  const trimmed = url.replace(/^\/+/, "");
  const rootBase = API_BASE_URL.replace(/\/api\/?$/, "/");
  const looksLikeMediaPath =
    trimmed.startsWith("media/") ||
    trimmed.startsWith("uploads/") ||
    trimmed.startsWith("storage/") ||
    trimmed.startsWith("files/") ||
    trimmed.startsWith("images/");

  try {
    return looksLikeMediaPath
      ? new URL(trimmed, rootBase).toString()
      : new URL(url, API_BASE_URL).toString();
  } catch {
    return "";
  }
};

export const isVideoUrl = (url: string): boolean =>
  /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url) || url.includes("/video/upload/");
