export interface UpdateItem {
  id: number;
  property_id?: number | null;
  title: string;
  content: string;
  media_files?: Array<{
    media_type: "image" | "video";
    url: string;
  }>;
  media_urls?: string[];
  image_urls?: string[];
  image_url?: string;
  video_url?: string;
  likes_count?: number;
  comments_count?: number;
  created_at: string;
  updated_at: string;
}

export interface UpdateListResponse {
  updates: UpdateItem[];
  total: number;
  page: number;
  page_size: number;
}

export interface UpdateComment {
  id: number;
  update_id: number;
  user_id: number;
  user_name: string;
  user_avatar?: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateCommentResponse {
  comments: UpdateComment[];
  total: number;
  page: number;
  page_size: number;
}
