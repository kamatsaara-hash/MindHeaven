import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Share2, Search, Send, Flag } from 'lucide-react'
import { Card, Badge } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { fadeInUp, staggerContainer } from '@/animations/variants'
import { formatRelativeTime, getCategoryColor } from '@/utils/helpers'
import { apiService } from '@/services/api'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'react-hot-toast'
import type { Post, Comment } from '@/types'

const CommunityPage = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  
  // New Post State
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostCategory, setNewPostCategory] = useState('stress')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Comments State
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null)
  const [comments, setComments] = useState<Record<string, Comment[]>>({})
  const [newComment, setNewComment] = useState('')

  const categories = [
    { value: 'all', label: 'All Topics' },
    { value: 'stress', label: 'Stress' },
    { value: 'anxiety', label: 'Anxiety' },
    { value: 'depression', label: 'Depression' },
    { value: 'academic', label: 'Academic Pressure' },
    { value: 'burnout', label: 'Work Burnout' },
    { value: 'selfcare', label: 'Self Care' },
  ]

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [selectedCategory])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const data = await apiService.getPosts(selectedCategory === 'all' ? undefined : selectedCategory)
      setPosts(data)
    } catch (error) {
      toast.error('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      toast.error('Post content cannot be empty')
      return
    }
    
    setIsSubmitting(true)
    try {
      const newPost = await apiService.createPost(newPostContent, newPostCategory)
      setPosts([newPost, ...posts])
      setNewPostContent('')
      setShowNewPost(false)
      toast.success('Your story has been shared')
    } catch (error) {
      toast.error('Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleLike = async (postId: string) => {
    try {
      const result = await apiService.likePost(postId)
      // Optimistic update
      setPosts(posts.map((post) => {
        if (post.id === postId) {
          const isLiking = !post.liked;
          return {
            ...post,
            liked: isLiking,
            likes_count: isLiking ? post.likes_count + 1 : post.likes_count - 1
          }
        }
        return post
      }))
    } catch (error) {
      toast.error('Failed to like post')
    }
  }

  const toggleComments = async (postId: string) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null)
      return
    }
    
    setExpandedPostId(postId)
    try {
      const postComments = await apiService.getComments(postId)
      setComments({ ...comments, [postId]: postComments })
    } catch (error) {
      toast.error('Failed to load comments')
    }
  }

  const handlePostComment = async (postId: string) => {
    if (!newComment.trim()) return
    
    try {
      const createdComment = await apiService.createComment(postId, newComment)
      setComments({
        ...comments,
        [postId]: [...(comments[postId] || []), createdComment]
      })
      // Update comment count on post
      setPosts(posts.map(p => p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p))
      setNewComment('')
    } catch (error) {
      toast.error('Failed to post comment')
    }
  }

  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Community Support</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Share your experiences anonymously. You're not alone in this journey.
        </p>
      </motion.div>

      {/* New Post Button */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
        <Button variant="primary" size="lg" onClick={() => setShowNewPost(!showNewPost)}>
          {showNewPost ? 'Cancel' : '+ Share Your Story'}
        </Button>
      </motion.div>

      {/* New Post Form */}
      <AnimatePresence>
        {showNewPost && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <Card variant="glass" className="p-6 border border-lavender-200 dark:border-lavender-900/30 shadow-lg shadow-lavender-500/10">
              <textarea
                placeholder="Share your thoughts anonymously..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-lg p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-lavender-500 resize-none text-slate-800 dark:text-slate-200"
                rows={4}
              />
              <div className="flex gap-2 flex-wrap mb-4">
                {categories.slice(1).map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setNewPostCategory(cat.value)}
                    className={`px-3 py-1 text-sm rounded-full transition-all border ${
                      newPostCategory === cat.value
                        ? 'bg-lavender-500 border-lavender-500 text-white'
                        : 'bg-transparent border-slate-300 dark:border-slate-700 hover:border-lavender-400 dark:hover:border-lavender-400 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <Button variant="primary" onClick={handleCreatePost} isLoading={isSubmitting}>
                Post Anonymously
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2">
          {/* Search and Filter */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 backdrop-blur-sm"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedCategory === cat.value
                      ? 'bg-lavender-500 text-white shadow-md shadow-lavender-500/20'
                      : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 backdrop-blur-sm border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Posts Feed */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lavender-500 mx-auto"></div>
              <p className="mt-4 text-slate-500">Loading community stories...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No posts found. Be the first to share your story!
            </div>
          ) : (
            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
              {filteredPosts.map((post) => (
                <motion.div key={post.id} variants={fadeInUp}>
                  <Card variant="glass" className="overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="font-semibold">{post.author?.nickname || 'Anonymous'}</p>
                          <Badge className={getCategoryColor(post.category_id)} variant="info" size="sm">
                            {categories.find(c => c.value === post.category_id)?.label || post.category_id}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-slate-500">{formatRelativeTime(post.created_at)}</span>
                          {user && post.author?.id && user.id !== post.author.id && (
                            <Link
                              to={`/report-user?userId=${post.author.id}&name=${encodeURIComponent(post.author.nickname || 'Anonymous')}`}
                              title="Report User"
                              className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <Flag className="w-4 h-4" />
                            </Link>
                          )}
                        </div>
                      </div>

                      <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed whitespace-pre-wrap">{post.content}</p>

                      {/* Interactions */}
                      <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                            post.liked
                              ? 'bg-baby-pink-500/20 text-baby-pink-600 dark:text-baby-pink-400'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
                          <span className="text-sm font-medium">{post.likes_count}</span>
                        </button>

                        <button 
                          onClick={() => toggleComments(post.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                            expandedPostId === post.id 
                            ? 'bg-lavender-500/20 text-lavender-600 dark:text-lavender-400'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">{post.comments_count}</span>
                        </button>
                      </div>
                    </div>

                    {/* Comments Section */}
                    <AnimatePresence>
                      {expandedPostId === post.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800"
                        >
                          <div className="p-6">
                            {/* Comment Input */}
                            <div className="flex gap-3 mb-6">
                              <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handlePostComment(post.id)}
                                placeholder="Add a supportive comment..."
                                className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lavender-500"
                              />
                              <Button variant="primary" onClick={() => handlePostComment(post.id)}>
                                <Send className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Comment List */}
                            <div className="space-y-4">
                              {comments[post.id]?.length > 0 ? (
                                comments[post.id].map(comment => (
                                  <div key={comment.id} className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                      <span className="font-semibold text-sm">{comment.author?.nickname || 'Anonymous'}</span>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500">{formatRelativeTime(comment.created_at)}</span>
                                        {user && comment.author?.id && user.id !== comment.author.id && (
                                          <Link
                                            to={`/report-user?userId=${comment.author.id}&name=${encodeURIComponent(comment.author.nickname || 'Anonymous')}`}
                                            title="Report User"
                                            className="text-slate-400 hover:text-red-500 transition-colors p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                                          >
                                            <Flag className="w-3.5 h-3.5" />
                                          </Link>
                                        )}
                                      </div>
                                    </div>
                                    <p className="text-slate-700 dark:text-slate-300 text-sm">{comment.content}</p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-center text-slate-500 text-sm py-4">No comments yet. Be the first to reply!</p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Card variant="glass">
              <h3 className="text-lg font-bold mb-4">Trending Topics</h3>
              <div className="space-y-3">
                {['Mindfulness Techniques', 'Sleep Better Tonight', 'Stress Management', 'Self-Love Journey'].map(
                  (topic, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="cursor-pointer p-3 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    >
                      <p className="font-medium text-sm">{topic}</p>
                      <p className="text-xs text-slate-500">Active discussions</p>
                    </motion.div>
                  )
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-6">
            <Card variant="gradient" className="bg-gradient-to-br from-baby-pink-500/20 to-lavender-500/20 border-lavender-200 dark:border-lavender-900/50">
              <h3 className="font-bold mb-2">Need Support?</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                If you're in crisis, please reach out to a professional immediately.
              </p>
              <Button variant="primary" size="sm" className="w-full">
                Get Help Now
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CommunityPage
