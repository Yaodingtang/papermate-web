'use client'

import { useState, useEffect, useCallback } from 'react'
import { paperApi } from '@/lib/api'

export interface Paper {
  id: string
  title: string
  authors?: string
  year?: number
  status: string
  progress: number
  folder?: string
  tags?: string[]
  pdf_url?: string
  pdf_size?: number
  created_at?: string
  updated_at?: string
}

export interface PapersState {
  papers: Paper[]
  loading: boolean
  error: string | null
  total: number
}

export function usePapers(initialParams?: {
  status?: string
  search?: string
  page?: number
  limit?: number
}) {
  const [state, setState] = useState<PapersState>({
    papers: [],
    loading: true,
    error: null,
    total: 0,
  })
  
  const [params, setParams] = useState(initialParams || {})
  
  const fetchPapers = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const response = await paperApi.list(params)
      const data = response.data
      setState({
        papers: data.items || [],
        total: data.total || 0,
        loading: false,
        error: null,
      })
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.detail || '获取论文列表失败',
      }))
    }
  }, [params])
  
  useEffect(() => {
    fetchPapers()
  }, [fetchPapers])
  
  const updateParams = useCallback((newParams: Partial<typeof params>) => {
    setParams(prev => ({ ...prev, ...newParams }))
  }, [])
  
  const refresh = useCallback(() => {
    fetchPapers()
  }, [fetchPapers])
  
  return {
    ...state,
    params,
    updateParams,
    refresh,
  }
}

export function usePaper(paperId: string) {
  const [paper, setPaper] = useState<Paper | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const fetchPaper = useCallback(async () => {
    if (!paperId) return
    
    setLoading(true)
    setError(null)
    try {
      const response = await paperApi.get(paperId)
      setPaper(response.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || '获取论文详情失败')
    } finally {
      setLoading(false)
    }
  }, [paperId])
  
  useEffect(() => {
    fetchPaper()
  }, [fetchPaper])
  
  const updatePaper = useCallback(async (data: Partial<Paper>) => {
    if (!paperId) return
    
    try {
      const response = await paperApi.update(paperId, data)
      setPaper(response.data)
      return response.data
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || '更新论文失败')
    }
  }, [paperId])
  
  const deletePaper = useCallback(async () => {
    if (!paperId) return
    
    try {
      await paperApi.delete(paperId)
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || '删除论文失败')
    }
  }, [paperId])
  
  return {
    paper,
    loading,
    error,
    refresh: fetchPaper,
    updatePaper,
    deletePaper,
  }
}

export function usePaperUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  const upload = useCallback(async (file: File, folderId?: string) => {
    setUploading(true)
    setProgress(0)
    setError(null)
    
    try {
      const response = await paperApi.upload(file, folderId)
      setProgress(100)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.detail || '上传失败')
      throw err
    } finally {
      setUploading(false)
    }
  }, [])
  
  return {
    upload,
    uploading,
    progress,
    error,
  }
}
