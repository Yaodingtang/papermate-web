'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Download, Trash2, HardDrive, Cloud, CloudOff, Check, Clock, AlertCircle, ChevronRight, FileText, Search, MoreHorizontal, RefreshCw } from 'lucide-react'

const mockDownloads = [
  { id: 1, title: 'Attention Is All You Need', size: '2.3 MB', status: 'completed', downloadedAt: '2024-05-12', progress: 100 },
  { id: 2, title: 'BERT: Pre-training of Deep Bidirectional Transformers', size: '1.8 MB', status: 'completed', downloadedAt: '2024-05-11', progress: 100 },
  { id: 3, title: 'GPT-4 Technical Report', size: '5.2 MB', status: 'downloading', downloadedAt: null, progress: 67 },
  { id: 4, title: 'LoRA: Low-Rank Adaptation', size: '1.1 MB', status: 'pending', downloadedAt: null, progress: 0 },
  { id: 5, title: 'Vision Transformer (ViT)', size: '3.4 MB', status: 'failed', downloadedAt: null, progress: 45 },
]

const mockStorage = {
  used: 156.8,
  total: 500,
  papers: 23,
}

export default function DownloadsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'downloading' | 'pending' | 'failed'>('all')

  const filteredDownloads = mockDownloads.filter(d => {
    const matchSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = statusFilter === 'all' || d.status === statusFilter
    return matchSearch && matchStatus
  })

  const storagePercent = (mockStorage.used / mockStorage.total) * 100

  const statusConfig = {
    completed: { label: '已完成', color: 'text-green-600', bg: 'bg-green-100', icon: Check },
    downloading: { label: '下载中', color: 'text-blue-600', bg: 'bg-blue-100', icon: RefreshCw },
    pending: { label: '等待中', color: 'text-gray-600', bg: 'bg-gray-100', icon: Clock },
    failed: { label: '失败', color: 'text-red-600', bg: 'bg-red-100', icon: AlertCircle },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">离线下载</h1>
              <p className="text-gray-500 text-sm mt-1">下载论文到本地，无网络也能阅读</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200">
                <RefreshCw className="w-4 h-4" />
                全部刷新
              </button>
              <Link href="/bookshelf" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700">
                添加下载
              </Link>
            </div>
          </div>

          {/* 存储空间 */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <HardDrive className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">存储空间</p>
                  <p className="text-sm text-gray-500">{mockStorage.papers} 篇论文已下载</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{mockStorage.used} MB</p>
                <p className="text-sm text-gray-500">/ {mockStorage.total} MB</p>
              </div>
            </div>
            <div className="h-2 bg-white rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                style={{ width: `${storagePercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {storagePercent.toFixed(1)}% 已使用 · 剩余 {(mockStorage.total - mockStorage.used).toFixed(1)} MB
            </p>
          </div>
        </div>
      </div>

      {/* 工具栏 */}
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索下载..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
            {[
              { value: 'all', label: '全部' },
              { value: 'completed', label: '已完成' },
              { value: 'downloading', label: '下载中' },
              { value: 'failed', label: '失败' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value as any)}
                className={`px-3 py-1.5 text-sm transition-colors ${
                  statusFilter === opt.value
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
            <Cloud className="w-4 h-4" />
            <span>云端同步已开启</span>
          </div>
        </div>
      </div>

      {/* 下载列表 */}
      <div className="max-w-5xl mx-auto px-6 pb-8">
        {filteredDownloads.length === 0 ? (
          <div className="text-center py-16">
            <CloudOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">暂无下载</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDownloads.map(item => {
              const status = statusConfig[item.status as keyof typeof statusConfig]
              return (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span>{item.size}</span>
                        {item.downloadedAt && (
                          <>
                            <span>·</span>
                            <span>{item.downloadedAt} 下载</span>
                          </>
                        )}
                        <span>·</span>
                        <span className={`flex items-center gap-1 ${status.color}`}>
                          <status.icon className={`w-4 h-4 ${item.status === 'downloading' ? 'animate-spin' : ''}`} />
                          {status.label}
                        </span>
                      </div>
                      {item.status !== 'completed' && (
                        <div className="mt-2">
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                item.status === 'failed' ? 'bg-red-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{item.progress}% 完成</p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {item.status === 'completed' && (
                        <Link 
                          href={`/reading/${item.id}`}
                          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                        >
                          阅读
                        </Link>
                      )}
                      {item.status === 'failed' && (
                        <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">
                          重试
                        </button>
                      )}
                      {item.status === 'downloading' && (
                        <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">
                          暂停
                        </button>
                      )}
                      {item.status === 'pending' && (
                        <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                          开始
                        </button>
                      )}
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Trash2 className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 离线模式说明 */}
      <div className="max-w-5xl mx-auto px-6 pb-8">
        <div className="p-5 bg-white rounded-xl border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <CloudOff className="w-5 h-5 text-blue-600" />
            离线阅读说明
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• 已下载的论文可以在无网络时阅读</p>
            <p>• 批注和笔记会自动同步，网络恢复后上传到云端</p>
            <p>• 建议在 WiFi 环境下批量下载论文</p>
            <p>• 下载的 PDF 文件存储在本地，可在设置中管理存储空间</p>
          </div>
        </div>
      </div>
    </div>
  )
}