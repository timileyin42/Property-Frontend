import { useEffect, useMemo, useState } from "react";

const isAbsoluteUrl = (value: string) =>
  value.startsWith("http://") ||
  value.startsWith("https://") ||
  value.startsWith("blob:") ||
  value.startsWith("data:");

const normalizeAbsolute = (value: string) =>
  value.startsWith("//") ? `https:${value}` : value;

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://api.elycapfracprop.com/api";

const stripApiSuffix = (value: string) =>
  value.replace(/\/api\/?$/, "");

const MEDIA_BASE_URL =
  import.meta.env.VITE_MEDIA_BASE_URL ?? stripApiSuffix(API_BASE_URL);

const normalizeMediaPath = (value: string) => {
  if (value.startsWith("/media/")) return `${MEDIA_BASE_URL}${value}`;
  if (value.startsWith("media/")) return `${MEDIA_BASE_URL}/${value}`;
  return "";
};

const buildMediaUrl = (fileKey: string): string => {
  const directPath = normalizeMediaPath(fileKey);
  if (directPath) return directPath;
  const encoded = encodeURIComponent(fileKey);
  return `${MEDIA_BASE_URL}/media/${encoded}`;
};

export const getPresignedUrl = async (value?: string): Promise<string> => {
  if (!value) return "";
  if (isAbsoluteUrl(value) || value.startsWith("//")) {
    return normalizeAbsolute(value);
  }

  return buildMediaUrl(value);
};

export const getCachedPresignedUrl = (value?: string): string => {
  if (!value) return "";
  if (isAbsoluteUrl(value) || value.startsWith("//")) {
    return normalizeAbsolute(value);
  }
  return buildMediaUrl(value);
};

export const usePresignedUrl = (value?: string) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    let active = true;
    getPresignedUrl(value).then((resolved) => {
      if (active) setUrl(resolved);
    });
    return () => {
      active = false;
    };
  }, [value]);

  return url;
};

export const usePresignedUrls = (values: string[]) => {
  const [urls, setUrls] = useState<string[]>([]);
  const stableValues = useMemo(() => values.filter(Boolean), [values]);
  const key = useMemo(() => stableValues.join("|"), [stableValues]);

  useEffect(() => {
    let active = true;
    const unique = Array.from(new Set(stableValues));
    const resolveSequentially = async () => {
      const resolved: string[] = [];
      for (const value of unique) {
        if (!active) return;
        const url = await getPresignedUrl(value);
        if (url) resolved.push(url);
      }

      if (active) {
        setUrls(resolved);
      }
    };

    resolveSequentially();
    return () => {
      active = false;
    };
  }, [key, stableValues]);

  return urls;
};

export const isVideoUrl = (url: string): boolean =>
  /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
