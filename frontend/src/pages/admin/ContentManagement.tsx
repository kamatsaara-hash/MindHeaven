import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus, Edit3, Trash2, FileText, Image as ImageIcon, Video, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ContentManagement() {
  const [contentList, setContentList] = useState([
    { id: 1, title: 'Understanding Panic Attacks', category: 'Anxiety', type: 'Article', status: 'Published', views: 1240 },
    { id: 2, title: '5-Minute Guided Meditation', category: 'Self-care', type: 'Audio/Video', status: 'Draft', views: 0 },
    { id: 3, title: 'Coping with Academic Stress', category: 'Stress', type: 'Article', status: 'Published', views: 850 },
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Anxiety',
    type: 'Article',
    status: 'Draft'
  })

  const handleOpenModal = (item: any = null) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        title: item.title,
        category: item.category,
        type: item.type,
        status: item.status
      })
    } else {
      setEditingItem(null)
      setFormData({ title: '', category: 'Anxiety', type: 'Article', status: 'Draft' })
    }
    setShowModal(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingItem) {
      setContentList(contentList.map(c => c.id === editingItem.id ? { ...c, ...formData } : c))
      toast.success('Content updated successfully')
    } else {
      setContentList([{ id: Date.now(), ...formData, views: 0 }, ...contentList])
      toast.success('Content created successfully')
    }
    setShowModal(false)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      setContentList(contentList.filter(c => c.id !== id))
      toast.success('Content deleted successfully')
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <AdminPageHeader 
        title="Content Management" 
        description="Add, edit, and categorize mental health resources and articles."
        action={
          <Button className="bg-lavender-600 hover:bg-lavender-700 text-white border-none gap-2" onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4" />
            Create New Content
          </Button>
        }
      />

      <div className="grid gap-4">
        {contentList.map(item => (
          <Card key={item.id} className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                {item.type === 'Article' ? <FileText className="w-6 h-6 text-slate-500" /> : <Video className="w-6 h-6 text-slate-500" />}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-500">
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{item.category}</span>
                  <span>{item.type}</span>
                  <span>•</span>
                  <span className={item.status === 'Published' ? 'text-green-600' : 'text-orange-500'}>{item.status}</span>
                  {item.status === 'Published' && (
                    <>
                      <span>•</span>
                      <span>{item.views} views</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={() => handleOpenModal(item)}>
                <Edit3 className="w-4 h-4 mr-2" /> Edit
              </Button>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => handleDelete(item.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Content Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-semibold text-lg">{editingItem ? 'Edit Content' : 'Create Content'}</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500">
                    <option value="Anxiety">Anxiety</option>
                    <option value="Stress">Stress</option>
                    <option value="Self-care">Self-care</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500">
                    <option value="Article">Article</option>
                    <option value="Audio/Video">Audio/Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500">
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
                <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                  <Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button type="submit" className="bg-lavender-600 hover:bg-lavender-700 text-white">
                    {editingItem ? 'Save Changes' : 'Create'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
