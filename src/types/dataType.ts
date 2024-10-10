//유저 타입
export interface user {
  id: string
  email: string
  name: string
  nickname: string
  profile_image_url: string
  user_level: number
  post_count: number
  created_at: string
  point: number
}


//댓글 타입
export interface comment {
  id?: number;
  author: string;
  content: string;
  createdAt?: string;
  date: string;
  replies?: comment[];
}
