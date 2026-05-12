'use client'

import { useState } from 'react'
import { Plus, Search, Send, FileText, Calendar, Building, ExternalLink, Trash2, Bell, Clock, CheckCircle, AlertCircle, MoreHorizontal, Edit3, Link2, MessageSquare, Paperclip, ChevronDown, ChevronRight } from 'lucide-react'

const mockSubmissions = [
  {
    id: 1,
    title: '基于 Transformer 的多模态学习方法研究',
    journal: 'Nature Machine Intelligence',
    journalInfo: { impactFactor: 23.8, field: '人工智能', type: '期刊' },
    status: 'under_review',
    submittedDate: '2024-04-15',
    expectedDate: '2024-07-15',
    rounds: 1,
    timeline: [
      { date: '2024-04-15', event: '提交稿件', status: 'completed' },
      { date: '2024-04-18', event: '编辑初审通过', status: 'completed' },
      { date: '2024-04-20', event: '送外审', status: 'completed' },
      { date: '2024-07-15', event: '预计返回审稿意见', status: 'pending' },
    ],
    notes: '首次投稿，希望能顺利',
    reminders: [
      { date: '2024-06-15', content: '如果还没消息，考虑发邮件询问' }
    ],
  },
  {
    id: 2,
    title: '大规模语言模型的涌现能力分析',
    journal: 'ACL 2024',
    journalInfo: { impactFactor: null, field: '自然语言处理', type: '会议' },
    status: 'revision',
    submittedDate: '2024-03-20',
    expectedDate: '2024-05-20',
    rounds: 2,
    timeline: [
      { date: '2024-03-20', event: '提交摘要', status: 'completed' },
      { date: '2024-04-10', event: '收到审稿意见', status: 'completed' },
      { date: '2024-04-15', event: '提交修改稿', status: 'completed' },
      { date: '2024-05-20', event: '预计最终决定', status: 'pending' },
    ],
    notes: 'Reviewer 2 提出了很好的建议，已修改',
    reminders: [],
  },
  {
    id: 3,
    title: '知识图谱增强的问答系统',
    journal: 'EMNLP 2024',
    journalInfo: { impactFactor: null, field: '自然语言处理', type: '会议' },
    status: 'accepted',
    submittedDate: '2024-02-10',
    expectedDate: '2024-05-10',
    rounds: 1,
    timeline: [
      { date: '2024-02-10', event: '提交论文', status: 'completed' },
      { date: '2024-04-20', event: '收到录用通知', status: 'completed' },
      { date: '2024-05-01', event: '提交最终版本', status: 'completed' },
    ],
    notes: '🎉 已录用！',
    reminders: [],
  },
  {
    id: 4,
    title: '联邦学习中的隐私保护机制',
    journal: 'IEEE TPAMI',
    journalInfo: { impactFactor: 24.3, field: '机器学习', type: '期刊' },
    status: 'rejected',
    submittedDate: '2024-01-05',
    expectedDate: '2024-04-05',
    rounds: 1,
    timeline: [
      { date: '2024-01-05', event: '提交稿件', status: 'completed' },
      { date: '2024-03-20', event: '收到拒稿通知', status: 'completed' },
    ],
    notes: '审稿意见很有价值，计划修改后投其他期刊',
    reminders: [],
  },
  {
    id: 5,
    title: '高效注意力机制研究',
    journal: 'ICML 2024',
    journalInfo: { impactFactor: null, field: '机器学习', type: '会议' },
    status: 'submitted',
    submittedDate: '2024-05-01',
    expectedDate: '2024-06-15',
    rounds: 0,
    timeline: [
      { date: '2024-05-01', event: '提交论文', status: 'completed' },
      { date: '2024-06-15', event: '预计通知', status: 'pending' },
    ],
    notes: '',
    reminders: [],
  },
]

const statusConfig = {
  draft: { icon: FileText, label: '草稿', color: 'bg-gray-100 text-gray-700', bgColor: 'bg-gray-50' },
  submitted: { icon: Send, label: '已提交', color: 'bg-blue-100 text-blue-700', bgColor: 'bg-blue-50' },
  under_review: { icon: Clock, label: '审稿中', color: 'bg-amber-100 text-amber-700', bgColor: 'bg-amber-50' },
  revision: { icon: Edit3, label: '修改中', color: 'bg-purple-100 text-purple-700', bgColor: 'bg-purple-50' },
  accepted: { icon: CheckCircle, label: '已录用', color: 'bg-green-100 text-green-700', bgColor: 'bg-green-50' },
  rejected: { icon: AlertCircle, label: '已拒稿', color: 'bg-red-100 text-red-700', bgColor: 'bg-red-50' },
}

export default function TrackPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const filteredSubmissions = mockSubmissions.filter(sub => {
    const matchSearch = sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        sub.journal.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = statusFilter === 'all' || sub.status === statusFilter
    return matchSearch && matchStatus
  })

  const stats = {
    total: mockSubmissions.length,
    underReview: mockSubmissions.filter(s => s.status === 'under_review').length,
    accepted: mockSubmissions.filter(s => s.status === 'accepted').length,
    rejected: mockSubmissions.filter(s => s.status === 'rejected').length,
  }

  // 即将到期的投稿
  const upcomingDeadlines = mockSubmissions
    .filter(s => s.status !== 'accepted' && s.status !== 'rejected' && s.expectedDate)
    .sort((a, b) => new Date(a.expectedDate).getTime() - new Date(b.expectedDate).getTime())
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">投稿追踪</h1>
              <p className="text-gray-500 text-sm mt-1">管理论文投稿状态，追踪审稿进度，设置提醒</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200">
                <Bell className="w-4 h-4" />
                提醒设置
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                新建投稿
              </button>
            </div>
          </div>

          {/* 统计 */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">总投稿</div>
            </div>
            <div className="bg-amber-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-amber-700">{stats.underReview}</div>
              <div className="text-sm text-amber-600">审稿中</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-700">{stats.accepted}</div>
              <div className="text-sm text-green-600">已录用</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-red-700">{stats.rejected}</div>
              <div className="text-sm text-red-600">已拒稿</div>
            </div>
          </div>

          {/* 即将到期提醒 */}
          {upcomingDeadlines.length > 0 && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <h3 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
                <Bell className="w-4 h-4" />
                近期截止日期
              </h3>
              <div className="space-y-2">
                {upcomingDeadlines.map(sub => (
                  <div key={sub.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{sub.journal}</span>
                    <span className="text-amber-700 font-medium">{sub.expectedDate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
              placeholder="搜索投稿..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
            {[
              { value: 'all', label: '全部' },
              { value: 'under_review', label: '审稿中' },
              { value: 'revision', label: '修改中' },
              { value: 'accepted', label: '已录用' },
              { value: 'rejected', label: '已拒稿' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
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
        </div>
      </div>

      {/* 投稿列表 */}
      <div className="max-w-5xl mx-auto px-6 pb-8">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">暂无投稿记录</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">添加第一个投稿</button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSubmissions.map(sub => {
              const status = statusConfig[sub.status as keyof typeof statusConfig]
              const isExpanded = expandedId === sub.id
              
              return (
                <div key={sub.id} className={`bg-white rounded-xl border ${isExpanded ? 'border-blue-200' : 'border-gray-200'} overflow-hidden`}>
                  {/* 主信息 */}
                  <div 
                    className="p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${status.bgColor}`}>
                        <FileText className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 line-clamp-1">{sub.title}</h3>
                          <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            {sub.journal}
                          </span>
                          {sub.journalInfo.impactFactor && (
                            <span>IF: {sub.journalInfo.impactFactor}</span>
                          )}
                          <span>{sub.journalInfo.type}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            提交: {sub.submittedDate}
                          </span>
                          <span>预计回复: {sub.expectedDate}</span>
                          {sub.rounds > 0 && <span>第 {sub.rounds} 轮</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </button>
                        {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                      </div>
                    </div>
                  </div>

                  {/* 展开详情 */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 p-4 bg-gray-50">
                      <div className="grid grid-cols-2 gap-6">
                        {/* 时间线 */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-3">投稿进度</h4>
                          <div className="space-y-3">
                            {sub.timeline.map((item, i) => (
                              <div key={i} className="flex items-start gap-3">
                                <div className={`w-2 h-2 rounded-full mt-1.5 ${item.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'}`} />
                                <div>
                                  <p className="text-sm text-gray-900">{item.event}</p>
                                  <p className="text-xs text-gray-500">{item.date}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 备注和提醒 */}
                        <div className="space-y-4">
                          {sub.notes && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">备注</h4>
                              <p className="text-sm text-gray-600 bg-white p-3 rounded-lg">{sub.notes}</p>
                            </div>
                          )}
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">快捷操作</h4>
                            <div className="flex flex-wrap gap-2">
                              <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                                <MessageSquare className="w-3 h-3" />
                                添加备注
                              </button>
                              <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                                <Bell className="w-3 h-3" />
                                设置提醒
                              </button>
                              <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                                <Link2 className="w-3 h-3" />
                                关联论文
                              </button>
                              <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                                <Paperclip className="w-3 h-3" />
                                上传文件
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}