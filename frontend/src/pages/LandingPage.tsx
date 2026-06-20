import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Users, BookOpen, AlertCircle, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAuth } from '@/context/AuthContext'
import {
  fadeInUp,
  staggerContainer,
  floatAnimation,
  glowAnimation,
} from '@/animations/variants'

const LandingPage = () => {
  const { guestLogin, isAuthenticated } = useAuth()
  const [isLoadingGuest, setIsLoadingGuest] = useState(false)

  const handleGuestLogin = async () => {
    setIsLoadingGuest(true)
    try {
      await guestLogin()
    } finally {
      setIsLoadingGuest(false)
    }
  }

  const features = [
    {
      icon: Heart,
      title: 'Mental Wellness',
      description: 'Access mental health resources and support communities',
    },
    {
      icon: Users,
      title: 'Anonymous Community',
      description: 'Share your experiences safely with like-minded individuals',
    },
    {
      icon: BookOpen,
      title: 'Educational Content',
      description: 'Learn about mental health, mindfulness, and self-care',
    },
    {
      icon: AlertCircle,
      title: 'Emergency Support',
      description: 'Quick access to professional help and crisis resources',
    },
  ]

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Student',
      text: 'MindHaven helped me find support during my toughest times. The community is truly compassionate.',
      avatar: '👩‍🎓',
    },
    {
      name: 'James K.',
      role: 'Professional',
      text: 'The resources here are incredibly helpful for managing work stress. Highly recommended!',
      avatar: '👨‍💼',
    },
    {
      name: 'Alex J.',
      role: 'Student',
      text: 'Finally a safe space to share without judgment. Thank you, MindHaven!',
      avatar: '👨‍🎓',
    },
  ]

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-lavender-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-soft-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pastel-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-4xl mx-auto text-center z-10"
        >
          <motion.div variants={fadeInUp} className="mb-8">
            <div className="inline-block mb-6">
              <motion.div
                className="flex items-center justify-center gap-2 px-4 py-2 bg-lavender-100 dark:bg-lavender-900/20 rounded-full border border-lavender-200 dark:border-lavender-800"
                variants={glowAnimation}
              >
                <Heart className="w-4 h-4 text-baby-pink-500" />
                <span className="text-sm font-medium text-lavender-700 dark:text-lavender-300">
                  Your Mental Wellness Matters
                </span>
              </motion.div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-gradient">Mental Health</span>
              <br />
              <span className="text-slate-900 dark:text-white">Made Accessible</span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              A compassionate platform for mental wellness. Access anonymous support, educational resources,
              and connect with professionals who care about your journey.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {isAuthenticated ? (
              <>
                <Link to="/community">
                  <Button variant="primary" size="lg">
                    Explore Community <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/resources">
                  <Button variant="secondary" size="lg">
                    Browse Resources <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Button variant="primary" size="lg" onClick={handleGuestLogin} isLoading={isLoadingGuest}>
                  Continue as Guest <ArrowRight className="w-5 h-5" />
                </Button>
                <Link to="/signup">
                  <Button variant="outline" size="lg">
                    Create Account
                  </Button>
                </Link>
              </>
            )}
          </motion.div>

          {/* Hero Image */}
          <motion.div variants={floatAnimation} animate="animate" className="relative">
            <div className="aspect-video rounded-3xl overflow-hidden glass border border-white/20">
              <div className="w-full h-full bg-gradient-to-br from-lavender-500/20 to-soft-teal-500/20 flex items-center justify-center">
                <Heart className="w-32 h-32 text-lavender-300 opacity-20" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose MindHaven?</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              A comprehensive platform dedicated to your mental wellbeing
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div key={index} variants={fadeInUp}>
                  <Card variant="glass" className="h-full">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-lavender-500 to-soft-teal-500 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">What Our Community Says</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Real stories from people who found support and hope
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card variant="gradient" className="h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">{testimonial.avatar}</div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 flex-grow">{testimonial.text}</p>
                  <div className="flex gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-baby-pink-500 text-baby-pink-500" />
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Emergency Banner */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-baby-pink-500/10 to-lavender-500/10 border-t-4 border-baby-pink-500"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-baby-pink-600 dark:text-baby-pink-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2">Need Immediate Help?</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                If you're experiencing a mental health crisis, please reach out to emergency services or a crisis hotline immediately.
              </p>
              <Link to="/professional-help">
                <Button variant="primary">Find Help Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            Join thousands of people finding support and wellness on MindHaven
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/community">
              <Button variant="primary" size="lg">
                Join Community
              </Button>
            </Link>
            <Link to="/resources">
              <Button variant="outline" size="lg">
                Explore Resources
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
