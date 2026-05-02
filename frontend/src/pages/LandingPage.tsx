import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, TrendingUp, MessageSquare, BarChart3 } from 'lucide-react'

const LandingPage = () => {
  const features = [
    {
      icon: MessageSquare,
      title: 'Real-time Feedback',
      description: 'Get instant AI-powered feedback on your responses',
      color: 'from-coral to-peach',
    },
    {
      icon: TrendingUp,
      title: 'Multi-modal Analysis',
      description: 'Analyze verbal, non-verbal, and technical skills',
      color: 'from-peach to-amber',
    },
    {
      icon: BarChart3,
      title: 'Track Your Growth',
      description: 'Monitor your progress with detailed analytics',
      color: 'from-amber to-coral',
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-coral/20 dark:bg-coral/30"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card mb-6"
            >

            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="text-warm-gray dark:text-warm-white-text">
                Your AI Interview Coach –
              </span>
              <br />
              <span className="gradient-text">Practice, Perfect,</span>
              <br />
              <span className="gradient-text">Land Your Dream Job</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-warm-gray/80 dark:text-warm-white-text/80 mb-8 max-w-2xl"
            >
              Master your interview skills with personalized AI coaching. Get real-time feedback,
              track your progress, and build confidence for your next big opportunity.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link to="/upload">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-coral to-peach text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow flex items-center space-x-2 group"
                >
                  <span>Start New Interview</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>

              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl glass-card border-2 border-coral/30 dark:border-coral/50 text-coral dark:text-coral-light font-semibold text-lg hover:bg-coral/10 dark:hover:bg-coral/20 transition-colors"
                >
                  View My Progress
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column - 3D Avatar */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <div className="w-80 h-80 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-coral via-peach to-amber flex items-center justify-center shadow-2xl relative overflow-hidden">
                {/* Animated gradient overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
                {/* Avatar placeholder - in production, use a 3D model or illustration */}
                <div className="relative z-10 text-center">
                  <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-4 border-4 border-white/30">
                    <span className="text-6xl md:text-8xl">🤖</span>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-white font-bold text-xl md:text-2xl"
                  >
                    Your AI Coach
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6 mt-20"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass-card rounded-2xl p-6 hover:shadow-2xl transition-shadow"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-warm-gray dark:text-warm-white-text mb-2">
                  {feature.title}
                </h3>
                <p className="text-warm-gray/70 dark:text-warm-white-text/70">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}

export default LandingPage

