'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MessageSquare, Send, Heart, Reply, MoreHorizontal, User, Clock, Pin, Bell, ChevronRight, FileText, AtSign, Smile, Paperclip } from 'lucide-react'

const mockPaper = {
  id: 1,
  title: 'Attention Is All You Need',
}

const mockDiscussions = [
  {
    id: 1,
    user: { name: '张教授', avatar: '👨‍🏫', role: '导师' },
    content: '这篇论文的核心创新在于完全摒弃了 RNN 和 CNN 结构，只使用注意力机制。大家觉得这种设计在实际应用中有什么优势和局限性？',
    time: '2小时前',
    likes: 5,
    replies: [
      {
        id: 11,
        user: { name: '李博士', avatar: '👨‍🔬', role: '博士' },
        content: '优势是并行计算效率高，可以处理长序列；局限性是 O(n²) 的计算复杂度，对于超长序列还是有挑战。',
        time: '1小时前',
        likes: 2,
      },
      {
        id: 12,
        user: { name: '王同学', avatar: '👨‍🎓', role: '硕士' },
        content: '我觉得位置编码的设计也很巧妙，虽然简单但很有效。不过现在有很多改进的位置编码方案了。',
        time: '30分钟前',
        likes: 1,
      },
    ],
    pinned: true,
  },
  {
    id: 2,
    user: { name: '赵同学', avatar: '👩‍🎓', role: '硕士' },
    content: '请问 Multi-Head Attention 中为什么要用多个 head？单个 head 不是也能学习到不同的注意力模式吗？',
    time: '3小时前',
    likes: 3,
    replies: [
      {
        id: 21,
        user: { name: '张教授', avatar: '👨‍🏫', role: '导师' },
        content: '多个 head 可以让模型同时关注不同位置和不同表示子空间的信息，类似于 CNN 中的多通道。单个 head 的表达能力有限。',
        time: '2小时前',
        likes: 4,
      },
    ],
    pinned: false,
  },
  {
    id: 3,
    user: { name: '刘同学', avatar: '👨‍🎓', role: '硕士' },
    content: '论文中提到的 Layer Normalization 和 Batch Normalization 有什么区别？为什么 Transformer 选择 Layer Norm？',
    time: '1天前',
    likes: 2,
    replies: [],
    pinned: false,
  },
]

export default function DiscussionPage() {
  const [newMessage, setNewMessage] = useState('')
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [sortBy, setSortBy] = useState<'time' | 'likes'>('time')

  const handleSubmit = () => {
    if (newMessage.trim()) {
      // 模拟发送
      console.log('发送:', newMessage)
      setNewMessage('')
    }
  }

  const handleReply = (discussionId: number) => {
    if (replyContent.trim()) {
      console.log('回复:', discussionId, replyContent)
      setReplyContent('')
      setReplyingTo(null)
    }
  }

  const pinnedDiscussions = mockDiscussions.filter(d => d.pinned)
  const normalDiscussions = mockDiscussions.filter(d => !d.pinned).sort((a, b) => 
    sortBy === 'likes' ? b.likes - a.likes : 0
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/team" className="hover:text-gray-700">团队</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/reading/${mockPaper.id}`} className="hover:text-gray-700">{mockPaper.title}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">讨论区</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{mockPaper.title}</h1>
                <p className="text-sm text-gray-500">团队讨论 · {mockDiscussions.length} 条讨论</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm">
                <Bell className="w-4 h-4" />
                订阅通知
              </button>
              <Link href={`/reading/${mockPaper.id}`} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
                返回阅读
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 内容 */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* 发送消息 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="发表你的看法或提问..."
                className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                rows={3}
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="提及成员">
                    <AtSign className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="添加表情">
                    <Smile className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="引用论文段落">
                    <Paperclip className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!newMessage.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  发送
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 排序 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-gray-900">讨论列表</h2>
          <div className="flex bg-gray-100 rounded-lg overflow-hidden">
            <button
              onClick={() => setSortBy('time')}
              className={`px-3 py-1.5 text-sm ${sortBy === 'time' ? 'bg-white shadow-sm' : ''}`}
            >
              按时间
            </button>
            <button
              onClick={() => setSortBy('likes')}
              className={`px-3 py-1.5 text-sm ${sortBy === 'likes' ? 'bg-white shadow-sm' : ''}`}
            >
              按热度
            </button>
          </div>
        </div>

        {/* 置顶讨论 */}
        {pinnedDiscussions.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Pin className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-600">置顶讨论</span>
            </div>
            {pinnedDiscussions.map(discussion => (
              <DiscussionCard
                key={discussion.id}
                discussion={discussion}
                replyingTo={replyingTo}
                replyContent={replyContent}
                setReplyingTo={setReplyingTo}
                setReplyContent={setReplyContent}
                handleReply={handleReply}
              />
            ))}
          </div>
        )}

        {/* 普通讨论 */}
        <div className="space-y-4">
          {normalDiscussions.map(discussion => (
            <DiscussionCard
              key={discussion.id}
              discussion={discussion}
              replyingTo={replyingTo}
              replyContent={replyContent}
              setReplyingTo={setReplyingTo}
              setReplyContent={setReplyContent}
              handleReply={handleReply}
            />
          ))}
        </div>

        {/* 空状态 */}
        {mockDiscussions.length === 0 && (
          <div className="text-center py-16">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">暂无讨论</p>
            <p className="text-sm text-gray-400 mt-1">发表第一条讨论吧！</p>
          </div>
        )}
      </div>
    </div>
  )
}

interface DiscussionCardProps {
  discussion: any
  replyingTo: number | null
  replyContent: string
  setReplyingTo: (id: number | null) => void
  setReplyContent: (content: string) => void
  handleReply: (id: number) => void
}

function DiscussionCard({ discussion, replyingTo, replyContent, setReplyingTo, setReplyContent, handleReply }: DiscussionCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* 主讨论 */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
            {discussion.user.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900">{discussion.user.name}</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded">{discussion.user.role}</span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {discussion.time}
              </span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{discussion.content}</p>
            <div className="flex items-center gap-4 mt-3">
              <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500">
                <Heart className="w-4 h-4" />
                {discussion.likes}
              </button>
              <button 
                onClick={() => setReplyingTo(discussion.id)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500"
              >
                <Reply className="w-4 h-4" />
                回复
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* 回复框 */}
        {replyingTo === discussion.id && (
          <div className="mt-4 ml-13 pl-4 border-l-2 border-blue-200">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="写下你的回复..."
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={2}
                />
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleReply(discussion.id)}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg"
                  >
                    发送
                  </button>
                  <button
                    onClick={() => { setReplyingTo(null); setReplyContent('') }}
                    className="px-3 py-1 text-gray-500 text-xs"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 回复列表 */}
        {discussion.replies.length > 0 && (
          <div className="mt-4 ml-13 space-y-3 pl-4 border-l-2 border-gray-200">
            {discussion.replies.map((reply: any) => (
              <div key={reply.id} className="flex items-start gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                  {reply.user.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-gray-900 text-sm">{reply.user.name}</span>
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-xs rounded">{reply.user.role}</span>
                    <span className="text-xs text-gray-500">{reply.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{reply.content}</p>
                  <button className="flex items-center gap-1 text-xs text-gray-500 mt-1 hover:text-red-500">
                    <Heart className="w-3 h-3" />
                    {reply.likes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}