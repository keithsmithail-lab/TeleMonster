'use client'

import { useState } from 'react'
import { MessageSquare, Heart, ThumbsUp, Clock, Reply, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateTime } from '@/lib/utils'

interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  timestamp?: number  // Position in recording
  type: 'coaching' | 'question' | 'praise' | 'improvement'
  reactions: Record<string, string[]>  // emoji -> user IDs
  replies: Comment[]
  createdAt: Date
}

interface CommentsPanelProps {
  recordingId: string
  comments: Comment[]
  onAddComment?: (content: string, timestamp?: number, type?: string) => void
  onAddReaction?: (commentId: string, emoji: string) => void
}

// Mock comments data - TODO: Replace with real data from API
const mockComments: Comment[] = [
  {
    id: '1',
    userId: 'coach1',
    userName: 'Coach Johnson',
    content: 'Great rapport building in the opening! You immediately acknowledged their time and showed appreciation. This is exactly what we want to see in the Connection stage.',
    timestamp: 8.7,
    type: 'praise',
    reactions: {
      '👍': ['user1', 'user2'],
      '💯': ['user3'],
    },
    replies: [
      {
        id: '1-1',
        userId: 'agent1',
        userName: 'Sarah Agent',
        content: 'Thank you! I\'ve been working on making that opening feel more natural.',
        type: 'coaching',
        reactions: {},
        replies: [],
        createdAt: new Date('2024-01-15T10:32:00'),
      }
    ],
    createdAt: new Date('2024-01-15T10:30:00'),
  },
  {
    id: '2',
    userId: 'coach1',
    userName: 'Coach Johnson',
    content: 'Consider probing deeper here about their concerns. You could ask "What specifically worries you about your current coverage?" to uncover more pain points.',
    timestamp: 29.1,
    type: 'improvement',
    reactions: {
      '🤔': ['user1'],
    },
    replies: [],
    createdAt: new Date('2024-01-15T10:35:00'),
  },
  {
    id: '3',
    userId: 'peer1',
    userName: 'Mike Peer',
    content: 'How do you handle it when prospects mention they already have coverage? I always struggle with that objection.',
    type: 'question',
    reactions: {},
    replies: [],
    createdAt: new Date('2024-01-15T10:40:00'),
  },
]

export function CommentsPanel({
  recordingId,
  comments = mockComments,
  onAddComment,
  onAddReaction,
}: CommentsPanelProps) {
  const [newComment, setNewComment] = useState('')
  const [selectedType, setSelectedType] = useState<'coaching' | 'question' | 'praise' | 'improvement'>('coaching')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const getCommentTypeColor = (type: string) => {
    switch (type) {
      case 'praise':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'improvement':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'question':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getCommentTypeIcon = (type: string) => {
    switch (type) {
      case 'praise':
        return '👏'
      case 'improvement':
        return '💡'
      case 'question':
        return '❓'
      default:
        return '💬'
    }
  }

  const handleSubmitComment = () => {
    if (!newComment.trim()) return
    
    if (onAddComment) {
      onAddComment(newComment, undefined, selectedType)
    }
    
    setNewComment('')
    setReplyingTo(null)
  }

  const handleReaction = (commentId: string, emoji: string) => {
    if (onAddReaction) {
      onAddReaction(commentId, emoji)
    }
  }

  const formatTimestamp = (timestamp: number) => {
    const minutes = Math.floor(timestamp / 60)
    const seconds = Math.floor(timestamp % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Comments</h3>
        <div className="text-sm text-muted-foreground">
          {comments.length} comments
        </div>
      </div>

      {/* Add new comment */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Add Comment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex space-x-2">
            {(['coaching', 'question', 'praise', 'improvement'] as const).map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(type)}
              >
                {getCommentTypeIcon(type)} {type}
              </Button>
            ))}
          </div>
          
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your feedback..."
            className="w-full min-h-[80px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
          
          <div className="flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              Tip: Click on transcript turns to add timestamp-specific comments
            </div>
            <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
              Post Comment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comments list */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {comments.map((comment) => (
          <Card key={comment.id} className="relative">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {comment.userName.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{comment.userName}</span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getCommentTypeColor(comment.type)}`}
                      >
                        {getCommentTypeIcon(comment.type)} {comment.type}
                      </Badge>
                      {comment.timestamp && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTimestamp(comment.timestamp)}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <span>{formatDateTime(comment.createdAt)}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed mb-3">{comment.content}</p>

                  {/* Reactions */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      {Object.entries(comment.reactions).map(([emoji, userIds]) => (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(comment.id, emoji)}
                          className="flex items-center space-x-1 px-2 py-1 rounded-full bg-accent hover:bg-accent/80 transition-colors"
                        >
                          <span className="text-sm">{emoji}</span>
                          <span className="text-xs text-muted-foreground">{userIds.length}</span>
                        </button>
                      ))}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => handleReaction(comment.id, '👍')}
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setReplyingTo(comment.id)}
                    >
                      <Reply className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                  </div>

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="mt-4 space-y-3 border-l-2 border-muted pl-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start space-x-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs">
                            {reply.userName.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-medium">{reply.userName}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDateTime(reply.createdAt)}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}