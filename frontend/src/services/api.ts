import axios, { AxiosInstance } from 'axios'
import type { PaginatedResponse, Post, Comment, Resource, Counselor, DashboardStats } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Don't redirect if it's a login attempt
        if (error.response?.status === 401 && !error.config.url?.includes('/auth/login')) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user')
          window.location.href = '/'
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth
  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', { email, password })
    return response.data
  }

  async register(email: string, password: string, nickname: string, phone: string) {
    const response = await this.api.post('/auth/signup', { email, password, nickname, phone })
    return response.data
  }

  async guestLogin() {
    const response = await this.api.post('/auth/guest')
    return response.data
  }

  // Posts
  async getPosts(category?: string, page: number = 1) {
    const response = await this.api.get<PaginatedResponse<Post>>('/posts', {
      params: { category, page, pageSize: 10 },
    })
    return response.data.data
  }

  async createPost(content: string, category: string) {
    const response = await this.api.post<Post>('/posts', {
      content,
      category_id: category,
    })
    return response.data
  }

  async likePost(postId: string) {
    const response = await this.api.post<{liked: boolean}>(`/posts/${postId}/like`)
    return response.data
  }

  async savePost(postId: string) {
    const response = await this.api.post<Post>(`/posts/${postId}/save`)
    return response.data
  }

  // Comments
  async getComments(postId: string) {
    const response = await this.api.get<Comment[]>(`/posts/${postId}/comments`)
    return response.data
  }

  async createComment(postId: string, content: string) {
    const response = await this.api.post<Comment>(`/posts/${postId}/comments`, {
      content,
    })
    return response.data
  }

  async likeComment(commentId: string) {
    const response = await this.api.post<Comment>(`/comments/${commentId}/like`)
    return response.data
  }

  // Resources
  async getResources(category?: string, page: number = 1) {
    const response = await this.api.get<PaginatedResponse<Resource>>('/resources', {
      params: { category, page, pageSize: 12 },
    })
    return response.data.data
  }

  async getResource(id: string) {
    const response = await this.api.get<Resource>(`/resources/${id}`)
    return response.data
  }

  async likeResource(resourceId: string) {
    const response = await this.api.post<Resource>(`/resources/${resourceId}/like`)
    return response.data
  }

  async saveResource(resourceId: string) {
    const response = await this.api.post<Resource>(`/resources/${resourceId}/save`)
    return response.data
  }

  // Counselors
  async getCounselors(specialization?: string) {
    const response = await this.api.get<Counselor[]>('/counselors', {
      params: { specialization },
    })
    return response.data
  }

  async getCounselor(id: string) {
    const response = await this.api.get<Counselor>(`/counselors/${id}`)
    return response.data
  }

  // Dashboard
  async getDashboardStats() {
    const response = await this.api.get<DashboardStats>('/dashboard/stats')
    return response.data
  }

  // Reports
  async reportContent(contentId: string, contentType: string, reason: string, description?: string) {
    const response = await this.api.post<{ id: string }>('/reports', {
      content_id: contentId,
      content_type: contentType,
      reason,
      description,
    })
    return response.data
  }

  async getUsersForReporting() {
    const response = await this.api.get<{ id: string; nickname: string }[]>('/reports/users')
    return response.data
  }

  // Saved Resources
  async getSavedResources() {
    const response = await this.api.get<Resource[]>('/user/saved-resources')
    return response.data
  }

  // Search
  async search(query: string, type: string = 'all') {
    const response = await this.api.get<{ posts: Post[]; resources: Resource[] }>('/search', {
      params: { q: query, type },
    })
    return response.data
  }
}

export const apiService = new ApiService()
