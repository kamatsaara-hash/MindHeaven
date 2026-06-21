import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Mail, Star, X, Clock, DollarSign, Award, BookOpen, MessageSquare } from 'lucide-react'
import { Card, Badge } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { staggerContainer, fadeInUp } from '@/animations/variants'
import { publicService } from '@/services/publicService'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

const ProfessionalHelpPage = () => {
  const [selectedCounselor, setSelectedCounselor] = useState<any>(null)
  const [counselors, setCounselors] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null)

  const { user } = useAuth()
  const [isBooking, setIsBooking] = useState(false)
  const [bookingDate, setBookingDate] = useState('2024-05-24')
  const [bookingTime, setBookingTime] = useState('10:00 AM')
  const [bookingNotes, setBookingNotes] = useState('Regular session')
  const [isBookingLoading, setIsBookingLoading] = useState(false)

  // Review state
  const [reviews, setReviews] = useState<any[]>([])
  const [isReviewing, setIsReviewing] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [hoverRating, setHoverRating] = useState(0)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const data = await publicService.getCounselors()
        setCounselors(data)
      } catch (error) {
        console.error('Failed to fetch counselors', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCounselors()
  }, [])

  const openCounselor = async (counselor: any) => {
    setSelectedCounselor(counselor)
    setIsBooking(false)
    setIsReviewing(false)
    setReviewRating(5)
    setReviewComment('')
    try {
      const data = await publicService.getReviews(counselor.id)
      setReviews(data)
    } catch {
      setReviews([])
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCounselor || !user) return
    setIsSubmittingReview(true)
    try {
      await publicService.submitReview(selectedCounselor.id, {
        user_id: user.id,
        user_nickname: user.nickname || 'Anonymous',
        rating: reviewRating,
        comment: reviewComment
      })
      toast.success('Review submitted!')
      const data = await publicService.getReviews(selectedCounselor.id)
      setReviews(data)
      setIsReviewing(false)
      setReviewComment('')
      setReviewRating(5)
      // Update counselor rating locally
      if (data.length > 0) {
        const avg = data.reduce((s: number, r: any) => s + r.rating, 0) / data.length
        setSelectedCounselor((prev: any) => ({ ...prev, rating: parseFloat(avg.toFixed(1)), reviews: data.length }))
      }
    } catch {
      toast.error('Failed to submit review.')
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCounselor) return;

    setIsBookingLoading(true);
    try {
      await publicService.bookAppointment({
        counselor_id: selectedCounselor.id,
        user_id: user?.id || 'guest-user-id',
        appointment_date: bookingDate,
        appointment_time: bookingTime,
        notes: bookingNotes
      });
      toast.success('Session scheduled successfully! Pending admin approval.');
      setSelectedCounselor(null);
      setIsBooking(false);
    } catch (err) {
      console.error('Failed to book appointment:', err);
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setIsBookingLoading(false);
    }
  };

  const specializations = Array.from(new Set(counselors.map(c => c.specialization)))

  const displayedCounselors = selectedSpecialization 
    ? counselors.filter(c => c.specialization === selectedSpecialization)
    : counselors

  const helplines = [
    {
      name: 'National Crisis Hotline',
      number: '988',
      availability: '24/7',
      description: 'Free crisis support and counseling',
    },
    {
      name: 'Mental Health Support',
      number: '1-800-950-NAMI',
      availability: '24/7',
      description: 'Support and resources for mental illness',
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Professional Help & Support</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Connect with verified mental health professionals and get the support you need
        </p>
      </motion.div>

      {/* Emergency Helplines */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Emergency Support Hotlines</h2>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid md:grid-cols-2 gap-6"
        >
          {helplines.map((helpline, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card variant="gradient" className="bg-gradient-to-br from-baby-pink-500/20 to-lavender-500/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-baby-pink-500/20 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-baby-pink-600 dark:text-baby-pink-400" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg">{helpline.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{helpline.description}</p>
                    <p className="font-mono font-bold text-lg text-baby-pink-600 dark:text-baby-pink-400 mb-2">
                      {helpline.number}
                    </p>
                    <Badge variant="success" size="sm">
                      {helpline.availability}
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Specialization Filter */}
      {specializations.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">Filter by Specialization</h3>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={!selectedSpecialization ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedSpecialization(null)}
              className={!selectedSpecialization ? "" : "bg-white dark:bg-slate-900"}
            >
              All ({counselors.length})
            </Button>
            {specializations.map(spec => (
              <Button 
                key={spec}
                variant={selectedSpecialization === spec ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedSpecialization(spec)}
                className={selectedSpecialization === spec ? "" : "bg-white dark:bg-slate-900"}
              >
                {spec}
              </Button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Verified Counselors */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <h2 className="text-2xl font-bold mb-6">Verified Counselors & Therapists</h2>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-6"
        >
          {isLoading ? (
            <div className="col-span-1 md:col-span-2 py-12 text-center text-slate-500">Loading counselors...</div>
          ) : displayedCounselors.length === 0 ? (
            <div className="col-span-1 md:col-span-2 py-12 text-center text-slate-500">No verified counselors available in this category.</div>
          ) : displayedCounselors.map((counselor) => (
            <motion.div key={counselor.id} variants={fadeInUp}>
              <Card variant="glass">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">{counselor.name}</h3>
                      {counselor.verified && (
                        <Badge variant="success" size="sm">
                          ✓ Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-lavender-600 dark:text-lavender-400 font-medium">
                      {counselor.specialization}
                    </p>
                  </div>
                </div>

                {counselor.bio && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {counselor.bio}
                  </p>
                )}

                <div className="flex items-center gap-2 mb-4 py-3 border-y border-slate-200 dark:border-slate-800">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(counselor.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{counselor.rating.toFixed(1)}</span>
                  <span className="text-xs text-slate-500">({counselor.reviews} reviews)</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  {counselor.hourly_rate > 0 && (
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                      <DollarSign className="w-4 h-4" />
                      <span>${counselor.hourly_rate}/hr</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                    <BookOpen className="w-4 h-4" />
                    <span>{counselor.sessions_completed} sessions</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full" onClick={() => openCounselor(counselor)}>
                  View Full Profile
                </Button>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Profile Modal */}
      <AnimatePresence>
        {selectedCounselor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      {isBooking ? 'Book a Session' : selectedCounselor.name}
                    </h2>
                    <Badge variant="info" size="sm">{selectedCounselor.specialization}</Badge>
                  </div>
                  <button onClick={() => { setSelectedCounselor(null); setIsBooking(false); }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {isBooking ? (
                  <form onSubmit={handleConfirmBooking} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Counselor</label>
                      <input 
                        type="text" 
                        readOnly 
                        value={selectedCounselor.name} 
                        className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 focus:outline-none"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Date</label>
                        <input 
                          type="date" 
                          required
                          value={bookingDate} 
                          onChange={(e) => setBookingDate(e.target.value)} 
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Time</label>
                        <select 
                          value={bookingTime} 
                          onChange={(e) => setBookingTime(e.target.value)} 
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 text-slate-900 dark:text-white"
                        >
                          <option value="09:00 AM">09:00 AM</option>
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="01:00 PM">01:00 PM</option>
                          <option value="02:30 PM">02:30 PM</option>
                          <option value="04:00 PM">04:00 PM</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Notes / Focus Area</label>
                      <textarea
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        placeholder="Explain what you would like to discuss..."
                        rows={3}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-500 text-slate-900 dark:text-white text-sm"
                      />
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                      <Button variant="outline" type="button" onClick={() => setIsBooking(false)}>Back</Button>
                      <Button type="submit" className="bg-lavender-600 hover:bg-lavender-700 text-white border-none" isLoading={isBookingLoading}>
                        Confirm Booking
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="space-y-6">
                      {/* Rating */}
                      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-yellow-50/30 dark:from-yellow-500/10 dark:to-yellow-500/5 rounded-xl">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(selectedCounselor.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                            />
                          ))}
                        </div>
                        <div>
                          <p className="font-semibold">{selectedCounselor.rating.toFixed(1)} out of 5</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{selectedCounselor.reviews} client reviews</p>
                        </div>
                      </div>

                      {/* About */}
                      <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <BookOpen className="w-5 h-5" />
                          About
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          {selectedCounselor.bio || 'Licensed professional ready to help you navigate life\'s challenges.'}
                        </p>
                      </div>

                      {/* Qualifications */}
                      {selectedCounselor.qualifications && selectedCounselor.qualifications.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            Qualifications
                          </h3>
                          <ul className="space-y-1">
                            {selectedCounselor.qualifications.map((qual: string, idx: number) => (
                              <li key={idx} className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-lavender-500 rounded-full"></span>
                                {qual}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Contact Information */}
                      <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <h3 className="font-semibold mb-3">Contact Information</h3>
                        {selectedCounselor.phone && (
                          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                            <Phone className="w-5 h-5 text-lavender-500" />
                            <span className="font-mono">{selectedCounselor.phone}</span>
                          </div>
                        )}
                        {selectedCounselor.email && (
                          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                            <Mail className="w-5 h-5 text-lavender-500" />
                            <span>{selectedCounselor.email}</span>
                          </div>
                        )}
                        {selectedCounselor.availability && (
                          <div className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                            <Clock className="w-5 h-5 text-lavender-500 mt-0.5" />
                            <div>
                              <p className="text-sm">Availability</p>
                              <p className="text-sm font-mono">{selectedCounselor.availability}</p>
                            </div>
                          </div>
                        )}
                        {selectedCounselor.hourly_rate > 0 && (
                          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-700">
                            <DollarSign className="w-5 h-5 text-lavender-500" />
                            <span className="font-semibold">${selectedCounselor.hourly_rate}/hour</span>
                          </div>
                        )}
                      </div>

                      {/* Sessions Info */}
                      <div className="p-4 bg-gradient-to-r from-lavender-50 to-baby-pink-50 dark:from-lavender-500/10 dark:to-baby-pink-500/10 rounded-xl">
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          <span className="font-semibold text-lg">{selectedCounselor.sessions_completed}</span> successful sessions completed
                        </p>
                      </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold flex items-center gap-2">
                          <MessageSquare className="w-5 h-5" />
                          Reviews ({reviews.length})
                        </h3>
                        {user && !user.is_anonymous && (
                          <Button size="sm" variant="outline" onClick={() => setIsReviewing(v => !v)}>
                            {isReviewing ? 'Cancel' : '+ Write Review'}
                          </Button>
                        )}
                      </div>

                      {/* Review Form */}
                      {isReviewing && (
                        <form onSubmit={handleSubmitReview} className="mb-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-3">
                          <div>
                            <p className="text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Your Rating</p>
                            <div className="flex gap-1">
                              {[1,2,3,4,5].map(star => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setReviewRating(star)}
                                  onMouseEnter={() => setHoverRating(star)}
                                  onMouseLeave={() => setHoverRating(0)}
                                  className="p-0.5 transition-transform hover:scale-110"
                                >
                                  <Star className={`w-6 h-6 ${
                                    star <= (hoverRating || reviewRating)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-slate-300'
                                  }`} />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <textarea
                              value={reviewComment}
                              onChange={e => setReviewComment(e.target.value)}
                              placeholder="Share your experience..."
                              rows={3}
                              className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lavender-500 text-slate-900 dark:text-white"
                            />
                          </div>
                          <Button type="submit" size="sm" className="bg-lavender-600 hover:bg-lavender-700 text-white border-none w-full" isLoading={isSubmittingReview}>
                            Submit Review
                          </Button>
                        </form>
                      )}

                      {/* Review List */}
                      <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                        {reviews.length === 0 ? (
                          <p className="text-sm text-slate-500 text-center py-4">No reviews yet. Be the first to review!</p>
                        ) : reviews.map((r: any) => (
                          <div key={r.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{r.user_nickname}</span>
                              <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(s => (
                                  <Star key={s} className={`w-3 h-3 ${s <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                                ))}
                              </div>
                            </div>
                            {r.comment && <p className="text-sm text-slate-600 dark:text-slate-400">{r.comment}</p>}
                            <p className="text-xs text-slate-400 mt-1">{new Date(r.created_at).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex gap-3">
                      <Button variant="primary" className="flex-1" onClick={() => setIsBooking(true)}>
                        Schedule Session
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={() => setSelectedCounselor(null)}>
                        Close
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProfessionalHelpPage
