import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Phone, HeartHandshake, Globe, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ResourcesHelplines() {
  const contacts = [
    { name: 'National Suicide Prevention Lifeline', phone: '988', type: 'Emergency', location: 'USA' },
    { name: 'Crisis Text Line', phone: 'Text HOME to 741741', type: 'Text Support', location: 'USA/UK/Canada' },
    { name: 'Trevor Project (LGBTQ)', phone: '1-866-488-7386', type: 'Specialized', location: 'USA' },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <AdminPageHeader 
        title="Resources & Helplines" 
        description="Manage emergency contacts, crisis helplines, and NGO directory."
        action={
          <Button className="bg-lavender-600 hover:bg-lavender-700 text-white border-none gap-2" onClick={() => toast.success('Add helpline clicked')}>
            <Plus className="w-4 h-4" />
            Add Helpline
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((contact, idx) => (
          <Card key={idx} className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative group">
            <button className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => toast.success('Delete helpline clicked')}>
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-1">{contact.name}</h3>
            <p className="text-xl font-bold text-lavender-600 dark:text-lavender-400 mb-4">{contact.phone}</p>
            
            <div className="flex flex-col gap-2 mt-auto">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <HeartHandshake className="w-4 h-4" />
                {contact.type}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Globe className="w-4 h-4" />
                {contact.location}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
