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
    <article className="group glass-panel glass-panel-hover rounded-xl overflow-hidden flex flex-col">
      <Link to={`/updates/${update.id}`} className="block h-44 overflow-hidden bg-surface-high">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={update.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
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
          <div className="h-full w-full flex items-center justify-center text-xs text-on-surface-variant">
            Media unavailable
          </div>
        )}
      </Link>
      <div className="p-5 space-y-2 flex flex-col flex-1 border-t border-[rgba(248,246,241,0.12)]">
        <span className="data-stat text-[11px] text-on-surface-variant uppercase tracking-widest">
          {new Date(update.created_at).toLocaleDateString()}
        </span>
        <Link to={`/updates/${update.id}`}>
          <h3 className="font-display text-xl text-on-surface group-hover:text-premium-gold transition-colors line-clamp-2">
            {update.title}
          </h3>
        </Link>
        <p className="text-sm text-on-surface-variant line-clamp-3 flex-1">{update.content}</p>
        <div className="flex items-center justify-between text-xs text-on-surface-variant pt-3 border-t border-[rgba(248,246,241,0.1)] mt-2">
          <span>{update.comments_count ?? 0} comments</span>
          <span className="text-premium-gold">{update.likes_count ?? 0} likes</span>
        </div>
      </div>
    </article>
  );
};

export default UpdateCard;
