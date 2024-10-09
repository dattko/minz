//유저 타입
export interface userProps {
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

//포스트 타입
export interface PostProps {
  title: string;
  content: string;
  author: string;
  createdAt: string;
  views: number;
  likes: number;
}