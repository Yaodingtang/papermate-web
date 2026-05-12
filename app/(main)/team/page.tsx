'use client'

import { useState } from 'react'
import { Plus, Search, Users, Mail, Crown, Edit, Trash2, MoreHorizontal, Shield, UserPlus, Settings, MessageSquare, FileText, FolderOpen, Activity, Bell, ChevronRight, User, Clock, Check, X } from 'lucide-react'

const mockTeam = {
  id: 1,
  name: 'NLP 研究组',
  description: '自然语言处理与机器学习研究团队，专注于大语言模型和知识图谱研究',
  avatar: '🧠',
  members: [
    { id: 1, name: '张教授', email: 'zhang@university.edu', role: 'owner', papers: 45, avatar: '👨‍🏫', lastActive: '刚刚' },
    { id: 2, name: '李博士', email: 'li@university.edu', role: 'admin', papers: 23, avatar: '👨‍🔬', lastActive: '2小时前' },
    { id: 3, name: '王同学', email: 'wang@university.edu', role: 'member', papers: 8, avatar: '👨‍🎓', lastActive: '1天前' },
    { id: 4, name: '赵同学', email: 'zhao@university.edu', role: 'member', papers: 5, avatar: '👩‍🎓', lastActive: '3天前' },
    { id: 5, name: '刘同学', email: 'liu@university.edu', role: 'member', papers: 3, avatar: '👨‍🎓', lastActive: '1周前' },
  ],
  sharedPapers: 81,
  sharedCards: 156,
  createdAt: '2023-09-01',
  settings: {
    allowMemberInvite: true,
    allowMemberUpload: true,
    requireApproval: false,
  }
}

const mockSharedPapers = [
  { id: 1, title: 'Attention Is All You Need', sharedBy: '张教授', sharedDate: '2024-03-15', readCount: 12, noteCount: 5 },
  { id: 2, title: 'BERT: Pre-training of Deep Bidirectional Transformers', sharedBy: '李博士', sharedDate: '2024-03-18', readCount: 8, noteCount: 3 },
  { id: 3, title: 'GPT-4 Technical Report', sharedBy: '张教授', sharedDate: '2024-04-02', readCount: 15, noteCount: 7 },
  { id: 4, title: 'LoRA: Low-Rank Adaptation', sharedBy: '王同学', sharedDate: '2024-04-10', readCount: 6, noteCount: 2 },
]

const mockActivities = [
  { id: 1, user: '张教授', action: '分享了论文', target: 'GPT-4 Technical Report', time: '2小时前' },
  { id: 2, user: '李博士', action: '创建了知识卡片', target: 'Transformer 架构核心思想', time: '3小时前' },
  { id: 3, user: '王同学', action: '添加了批注', target: 'BERT 论文第 5 页', time: '1天前' },
  { id: 4, user: '赵同学', action: '上传了论文', target: 'LoRA: Low-Rank Adaptation', time: '2天前' },
  { id: 5, user: '张教授', action: '更新了团队设置', target: '', time: '1周前' },
]

const mockInvitations = [
  { id: 1, email: 'newstudent@university.edu', invitedBy: '张教授', date: '2024-05-10', status: 'pending' },
]

const roleConfig = {
  owner: { label: '创建者', color: 'bg-yellow-100 text-yellow-700', icon: Crown, permissions: ['所有权限'] },
  admin: { label: '管理员', color: 'bg-blue-100 text-blue-700', icon: Shield, permissions: ['管理成员', '管理论文', '管理设置'] },
  member: { label: '成员', color: 'bg-gray-100 text-gray-700', icon: User, permissions: ['查看论文', '添加笔记', '上传论文'] },
}

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState<'members' | 'papers' | 'activity' | 'settings'>('members')
  const [searchQuery, setSearchQuery] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member')

  const filteredMembers = mockTeam.members.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    members: mockTeam.members.length,
    papers: mockTeam.sharedPapers,
    cards: mockTeam.sharedCards,
    activities: mockActivities.length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl">
                {mockTeam.avatar}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{mockTeam.name}</h1>
                <p className="text-gray-500 text-sm mt-1">{mockTeam.description}</p>
                <p className="text-xs text-gray-400 mt-1">创建于 {mockTeam.createdAt}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200">
                <Settings className="w-4 h-4" />
                团队设置
              </button>
              <button 
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700"
              >
                <UserPlus className="w-4 h-4" />
                邀请成员
              </button>
            </div>
          </div>

          {/* 统计 */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.members}</div>
                  <div className="text-sm text-gray-500">团队成员</div>
                </div>
                <Users className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-700">{stats.papers}</div>
                  <div className="text-sm text-blue-600">共享论文</div>
                </div>
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-700">{stats.cards}</div>
                  <div className="text-sm text-green-600">知识卡片</div>
                </div>
                <FolderOpen className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-700">{stats.activities}</div>
                  <div className="text-sm text-purple-600">近期动态</div>
                </div>
                <Activity className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center gap-6 border-b border-gray-200">
          {[
            { id: 'members', label: '成员管理', icon: Users },
            { id: 'papers', label: '共享论文', icon: FileText },
            { id: 'activity', label: '团队动态', icon: Activity },
            { id: 'settings', label: '团队设置', icon: Settings },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 内容 */}
      <div className="max-w-6xl mx-auto px-6 pb-8">
        {/* 成员管理 */}
        {activeTab === 'members' && (
          <div>
            {/* 搜索和筛选 */}
            <div className="flex items-center justify-between mb-4">
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索成员..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>角色筛选：</span>
                <button className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200">全部</button>
                <button className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200">管理员</button>
                <button className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200">成员</button>
              </div>
            </div>

            {/* 待处理邀请 */}
            {mockInvitations.length > 0 && (
              <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <h3 className="text-sm font-medium text-amber-800 mb-2">待处理的邀请</h3>
                {mockInvitations.map(inv => (
                  <div key={inv.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-amber-600" />
                      <span className="text-sm text-gray-700">{inv.email}</span>
                      <span className="text-xs text-gray-500">邀请人: {inv.invitedBy}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg">重新发送</button>
                      <button className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-lg">取消</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 成员列表 */}
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              {filteredMembers.map(member => {
                const role = roleConfig[member.role as keyof typeof roleConfig]
                return (
                  <div key={member.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                        {member.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{member.name}</h3>
                          {member.role === 'owner' && <Crown className="w-4 h-4 text-yellow-600" />}
                        </div>
                        <p className="text-sm text-gray-500">{member.email}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span>{member.papers} 篇论文</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {member.lastActive}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${role.color}`}>
                          {role.label}
                        </span>
                        {member.role !== 'owner' && (
                          <div className="flex items-center gap-1">
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                              <Edit className="w-4 h-4 text-gray-400" />
                            </button>
                            <button className="p-2 hover:bg-red-50 rounded-lg">
                              <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 共享论文 */}
        {activeTab === 'papers' && (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {mockSharedPapers.map(paper => (
              <div key={paper.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">{paper.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {paper.sharedBy} 分享于 {paper.sharedDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{paper.readCount} 次阅读</span>
                    <span>{paper.noteCount} 条笔记</span>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 团队动态 */}
        {activeTab === 'activity' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="space-y-4">
              {mockActivities.map(activity => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                    👤
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-900">{activity.user}</span>
                      {' '}{activity.action}{' '}
                      {activity.target && <span className="text-blue-600">{activity.target}</span>}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 团队设置 */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">权限设置</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">允许成员邀请他人</p>
                  <p className="text-sm text-gray-500">成员可以邀请新成员加入团队</p>
                </div>
                <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                  <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </button>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">允许成员上传论文</p>
                  <p className="text-sm text-gray-500">成员可以直接上传论文到团队</p>
                </div>
                <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                  <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">新成员需要审批</p>
                  <p className="text-sm text-gray-500">新成员加入需要管理员批准</p>
                </div>
                <button className="w-12 h-6 bg-gray-200 rounded-full relative">
                  <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                </button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-red-600 mb-4">危险操作</h3>
              <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50">
                解散团队
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 邀请成员弹窗 */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">邀请成员</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">邮箱地址</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="member@university.edu"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">角色</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none"
                >
                  <option value="member">成员 - 可查看和添加内容</option>
                  <option value="admin">管理员 - 可管理成员和设置</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowInviteModal(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm">取消</button>
              <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm">发送邀请</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}