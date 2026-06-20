// User Types
export interface UserWarning {
  reason: string
  date: string
}

export interface User {
  id: string
  email?: string
  nickname: string
  isAnonymous: boolean
  createdAt: string
  bio?: string
  avatar?: string
  warnings?: UserWarning[]
  status?: string
}

// Post Types
export type PostCategory = 'stress' | 'anxiety' | 'depression' | 'academic' | 'burnout' | 'selfcare'

export interface Post {
  id: string
  user_id: string
  content: string
  category_id: PostCategory
  likes_count: number
  comments_count: number
  liked: boolean
  saved: boolean
  created_at: string
  updated_at: string
  author: {
    id: string
    nickname: string
    avatar?: string
  }
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  content: string
  likes_count: number
  liked: boolean
  created_at: string
  author: {
    id: string
    nickname: string
    avatar?: string
  }
}

// Resource Types
export type ResourceCategory = 'mindfulness' | 'anxiety' | 'sleep' | 'stress' | 'selfcare'
export type ResourceType = 'article' | 'video' | 'infographic' | 'tip'

export interface Resource {
  id: string
  title: string
  description: string
  resource_type: ResourceType
  category_id: ResourceCategory
  content: string
  image_url?: string
  video_url?: string
  saved: boolean
  likes_count: number
  liked: boolean
  views: number
  created_at: string
  updated_at: string
  author: {
    id: string
    name: string
  }
}

// Counselor Types
export interface Counselor {
  id: string
  name: string
  specialization: string
  bio: string
  availability: string
  rating: number
  reviews: number
  photo?: string
  contactEmail?: string
  phone?: string
  verified: boolean
}

// Dashboard Types
export interface DashboardStats {
  totalPosts: number
  totalComments: number
  topCategory: PostCategory
  trendingTopics: string[]
  communityActivity: {
    date: string
    count: number
  }[]
}

// Analytics Types
export interface PostAnalytics {
  category: PostCategory
  count: number
}

export interface ResourceAnalytics {
  category: ResourceCategory
  count: number
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// Auth Types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  nickname: string
}

export interface AuthResponse {
  token: string
  user: User
}
