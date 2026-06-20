import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Heart, Eye, Filter } from 'lucide-react'
import { Card, Badge } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { staggerContainer, fadeInUp } from '@/animations/variants'

const ResourcesPage = () => {
  const [resources] = useState([
    {
      id: '1',
      title: '5 Mindfulness Techniques for Daily Stress',
      category: 'mindfulness',
      type: 'article',
      views: 1203,
      likes: 342,
      liked: false,
      saved: false,
    },
    {
      id: '2',
      title: 'Understanding Anxiety Disorders',
      category: 'anxiety',
      type: 'video',
      views: 2140,
      likes: 567,
      liked: false,
      saved: false,
    },
    {
      id: '3',
      title: 'Sleep Hygiene Guide',
      category: 'sleep',
      type: 'infographic',
      views: 891,
      likes: 234,
      liked: false,
      saved: false,
    },
  ])

  const categories = [
    'All Resources',
    'Mindfulness',
    'Anxiety Help',
    'Sleep Improvement',
    'Stress Management',
    'Self Care',
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Mental Health Resources</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Learn, grow, and find tools for your mental wellness journey
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Resources Grid */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {resources.map((resource) => (
          <motion.div key={resource.id} variants={fadeInUp}>
            <Card variant="glass" className="h-full flex flex-col">
              <div className="aspect-video bg-gradient-to-br from-lavender-500/20 to-soft-teal-500/20 rounded-lg mb-4 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-lavender-300" />
              </div>
              <h3 className="font-bold text-lg mb-2 flex-grow">{resource.title}</h3>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="info" size="sm">
                  {resource.type}
                </Badge>
                <span className="text-xs text-slate-500">{resource.category}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {resource.views}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {resource.likes}
                </div>
              </div>
              <Button 
                variant="primary" 
                size="sm" 
                className="w-full"
                onClick={() => window.open(`https://www.psychologytoday.com/us/basics/${resource.category === 'mindfulness' ? 'meditation' : resource.category === 'sleep' ? 'sleep' : resource.category}`, '_blank')}
              >
                Read More
              </Button>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default ResourcesPage
