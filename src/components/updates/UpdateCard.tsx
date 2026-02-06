import { Link } from "react-router-dom";
import type { UpdateItem } from "../../types/updates";
import { isVideoUrl, usePresignedUrls } from "../../util/normalizeMediaUrl";
import { useMemo } from "react";

interface UpdateCardProps {
  update: UpdateItem;
}

const getMediaKeys = (update: UpdateItem) => {
  const urls = [
    ...(update.media_files?.map((item) => item.url) ?? []),
    ...(update.media_urls ?? []),
    ...(update.image_urls ?? []),
    update.image_url,
    update.video_url,
  ].filter(Boolean) as string[];

  return urls;
};

const UpdateCard: React.FC<UpdateCardProps> = ({ update }) => {
  const mediaKeys = useMemo(() => getMediaKeys(update), [update]);
  const mediaUrls = usePresignedUrls(mediaKeys);
  const imageUrl = mediaUrls.find((url) => !isVideoUrl(url));
  const videoUrl = mediaUrls.find((url) => isVideoUrl(url));

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <Link to={`/updates/${update.id}`} className="block h-44 bg-gray-100">
        {imageUrl ? (
          <img src={imageUrl} alt={update.title} className="w-full h-full object-cover" />
        ) : videoUrl ? (
          <video
            className="w-full h-full object-cover"
            src={videoUrl}
            muted
            playsInline
            loop
            autoPlay
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">
            Media unavailable
          </div>
        )}
      </Link>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-blue-900 line-clamp-2">{update.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-3">{update.content}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>
            {new Date(update.created_at).toLocaleDateString()}
          </span>
          <span>
            {update.comments_count ?? 0} comments • {update.likes_count ?? 0} likes
          </span>
        </div>
      </div>
    </div>
  );
};

export default UpdateCard;
