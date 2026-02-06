import { useEffect, useState } from "react";
import { api, API_BASE_URL } from "../api/axios";

const presignCache = new Map<string, string>();
const presignInFlight = new Map<string, Promise<string>>();

const isAbsoluteUrl = (value: string) =>
  value.startsWith("http://") ||
  value.startsWith("https://") ||
  value.startsWith("blob:") ||
  value.startsWith("data:");

const normalizeAbsolute = (value: string) =>
  value.startsWith("//") ? `https:${value}` : value;

const FILES_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

const presignDownload = async (fileKey: string): Promise<string> => {
  const res = await api.post<{ download_url?: string }>(
    `${FILES_BASE_URL}/files/presign-download`,
    { file_key: fileKey }
  );
  return res.data?.download_url ?? "";
};

export const getPresignedUrl = async (value?: string): Promise<string> => {
  if (!value) return "";
  if (isAbsoluteUrl(value) || value.startsWith("//")) {
    return normalizeAbsolute(value);
  }

  const cached = presignCache.get(value);
  if (cached) return cached;

  const existing = presignInFlight.get(value);
  if (existing) return existing;

  const request = presignDownload(value)
    .then((url) => {
      if (url) presignCache.set(value, url);
      presignInFlight.delete(value);
      return url;
    })
    .catch(() => {
      presignInFlight.delete(value);
      return "";
    });

  presignInFlight.set(value, request);
  return request;
};

export const getCachedPresignedUrl = (value?: string): string => {
  if (!value) return "";
  if (isAbsoluteUrl(value) || value.startsWith("//")) {
    return normalizeAbsolute(value);
  }
  return presignCache.get(value) ?? "";
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
  const stableValues = values.filter(Boolean);
  const key = stableValues.join("|");

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
