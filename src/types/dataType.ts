//유저 타입
export interface User {
  id: string
  email: string
  name: string
  nickname: string
  profile_image_url: string
  user_level: number
  post_count: number
  created_at: string
  updated_at: string
  point: number
}

//포스트타입
export interface Posts {
  id?: string | number;
  title: string;
  content: string; // 포스트 내용
  author: string; // 작성자
  views: number;
  recommendations?: number; // 추천 수
  link?: string;
  created_at: string;
  updated_at?: string;
  comments?: Comment[];
  tags?: string[]; // 포스트 태그
  category?: string; // 포스트 카테고리
  status?: 'draft' | 'published' | 'archived'; // 포스트 상태
  featured_image?: string; // 대표 이미지 URL
  localImages?: {
    id: string;
    url: string;
    base64: string;
    type: string;
  }[];
}

export interface CreatePosts {
  title: string;
  content: string;
  localImages: {
    id: string;
    url: string;
    base64: string;
    type: string;
  }[];
  post_type: string;
}

export interface Comment {
  id?: number;
  post_id?: string | number; // 연관된 포스트 ID
  author: string;
  author_id?: string | number; // 작성자 ID
  content: string;
  created_at?: string;
  updated_at?: string;
  date: string;
  // recommendations: number; // 댓글 추천 수
  // is_approved: boolean; // 승인 여부
  parent_id?: number; // 부모 댓글 ID (대댓글용)
  replies?: Comment[];
}


//리스트
export interface ListItem {
  id: string;
  title: string;
  created_at: string;
  views: number;
  categories: { slug: string };
  comment_count: number;
  categoryName?: string;
  categorySlug?: string;
  
}