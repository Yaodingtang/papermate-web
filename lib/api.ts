import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8100/api/v1'

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 - 添加 token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token 过期，跳转登录
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ========== 认证 API ==========
export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  getProfile: () => api.get('/users/me'),
  
  updateProfile: (data: { name?: string; avatar_url?: string }) =>
    api.patch('/users/me', data),
}

// ========== 论文 API ==========
export const paperApi = {
  // 上传论文
  upload: (file: File, folderId?: string) => {
    const formData = new FormData()
    formData.append('file', file)
    if (folderId) formData.append('folder_id', folderId)
    return api.post('/papers/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // 获取论文列表
  list: (params?: {
    status?: string
    folder_id?: string
    tag?: string
    search?: string
    page?: number
    limit?: number
  }) => api.get('/papers', { params }),

  // 获取论文详情
  get: (id: string) => api.get(`/papers/${id}`),

  // 更新论文
  update: (id: string, data: {
    status?: string
    tags?: string[]
    folder_id?: string
  }) => api.patch(`/papers/${id}`, data),

  // 删除论文
  delete: (id: string) => api.delete(`/papers/${id}`),
}

// ========== 批注 API ==========
export const annotationApi = {
  create: (data: {
    paper_id: string
    type: 'highlight' | 'underline' | 'note' | 'bookmark'
    page: number
    position: object
    content?: string
    color?: string
  }) => api.post('/annotations', data),

  list: (paperId: string) => api.get('/annotations', { params: { paper_id: paperId } }),

  update: (id: string, data: { content?: string; color?: string }) =>
    api.patch(`/annotations/${id}`, data),

  delete: (id: string) => api.delete(`/annotations/${id}`),
}

// ========== 卡片 API ==========
export const cardApi = {
  create: (data: {
    paper_id: string
    question: string
    answer: string
    order: number
  }) => api.post('/cards', data),

  list: (paperId: string) => api.get('/cards', { params: { paper_id: paperId } }),

  update: (id: string, data: { answer?: string }) =>
    api.patch(`/cards/${id}`, data),

  delete: (id: string) => api.delete(`/cards/${id}`),
}

// ========== AI API ==========
export const aiApi = {
  // 划词解释
  explain: (data: { paper_id: string; text: string; context?: string }) =>
    api.post('/ai/explain', data),

  // 论文问答
  qa: (data: { paper_id: string; question: string }) =>
    api.post('/ai/qa', data),

  // 语义搜索
  search: (data: { query: string; limit?: number }) =>
    api.post('/ai/search', data),

  // 生成摘要
  summary: (data: { paper_id: string }) =>
    api.post('/ai/summary', data),
}