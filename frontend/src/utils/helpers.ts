// Class name utilities
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

// Format date
export function formatDate(date: string | Date) {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Format relative time
export function formatRelativeTime(date: string | Date) {
  const d = new Date(date)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`

  return formatDate(d)
}

// Truncate text
export function truncate(text: string, length: number = 100) {
  return text.length > length ? text.substring(0, length) + '...' : text
}

// Generate random ID
export function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Get category color
export function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    stress: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
    anxiety: 'bg-purple-500/20 text-purple-700 dark:text-purple-300',
    depression: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300',
    academic: 'bg-orange-500/20 text-orange-700 dark:text-orange-300',
    burnout: 'bg-red-500/20 text-red-700 dark:text-red-300',
    selfcare: 'bg-green-500/20 text-green-700 dark:text-green-300',
    mindfulness: 'bg-teal-500/20 text-teal-700 dark:text-teal-300',
    sleep: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300',
  }
  return colors[category] || 'bg-gray-500/20 text-gray-700 dark:text-gray-300'
}

// Get category gradient
export function getCategoryGradient(category: string) {
  const gradients: Record<string, string> = {
    stress: 'from-blue-400 to-blue-600',
    anxiety: 'from-purple-400 to-purple-600',
    depression: 'from-indigo-400 to-indigo-600',
    academic: 'from-orange-400 to-orange-600',
    burnout: 'from-red-400 to-red-600',
    selfcare: 'from-green-400 to-green-600',
    mindfulness: 'from-teal-400 to-teal-600',
    sleep: 'from-indigo-400 to-indigo-600',
  }
  return `bg-gradient-to-r ${gradients[category] || 'from-gray-400 to-gray-600'}`
}
