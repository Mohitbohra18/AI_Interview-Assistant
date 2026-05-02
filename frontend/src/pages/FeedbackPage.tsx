import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Trophy,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Download,
  RotateCcw,
  BarChart3,
  Lightbulb,
  Save,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Area, AreaChart } from 'recharts'
import { useInterview } from '../contexts/InterviewContext'

const FeedbackPage = () => {
  const navigate = useNavigate()
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)
  const { scores: rawScores, feedbacks } = useInterview()

  const overallScore = rawScores.length > 0 
    ? Math.round((rawScores.reduce((a, b) => a + b, 0) / rawScores.length) * 10) 
    : 0
  const scores = {
    verbal: 85,
    nonVerbal: 78,
    technical: 88,
  }

  const pieData = [
    { name: 'Score', value: overallScore },
    { name: 'Remaining', value: 100 - overallScore },
  ]

  const COLORS = ['#FF6B6B', '#E0E0E0']

  const performanceData = [
    { session: 'Session 1', score: 65 },
    { session: 'Session 2', score: 72 },
    { session: 'Session 3', score: 78 },
    { session: 'Session 4', score: 82 },
  ]

  const questions = rawScores.map((score, i) => ({
      id: i + 1,
      question: `Question ${i + 1}`,
      type: 'Interview Question',
      score: score * 10,
      status: score >= 8 ? 'strong' : score >= 6 ? 'improve' : 'weak',
      feedback: feedbacks[i] || 'No feedback provided',
  }))

  const suggestions = [
    'Practice speaking at a slightly slower pace to improve clarity',
    'Maintain more consistent eye contact with the camera',
    'Use more specific examples when discussing your achievements',
    'Work on reducing filler words like "um" and "uh"',
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'strong':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'improve':
        return <AlertCircle className="w-5 h-5 text-amber-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-coral" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'strong':
        return 'bg-green-500/20 text-green-600 dark:text-green-400'
      case 'improve':
        return 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
      default:
        return 'bg-coral/20 text-coral'
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-warm-gray dark:text-warm-white-text">Your Interview </span>
            <span className="gradient-text">Feedback</span>
          </h1>
          <p className="text-xl text-warm-gray/70 dark:text-warm-white-text/70">
            Great job completing the interview! Here's your detailed performance analysis.
          </p>
        </motion.div>

        {/* Score Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-8 mb-8"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                <Trophy className="w-12 h-12 text-amber" />
                <div>
                  <h2 className="text-3xl font-bold text-warm-gray dark:text-warm-white-text">
                    Overall Score
                  </h2>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="text-6xl font-bold gradient-text"
                  >
                    {overallScore}
                  </motion.div>
                </div>
              </div>
              <p className="text-warm-gray/70 dark:text-warm-white-text/70">
                You're improving! Keep up the great work.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="relative w-64 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold gradient-text">{overallScore}%</div>
                    <div className="text-sm text-warm-gray/60 dark:text-warm-white-text/60">
                      Score
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scores Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          {Object.entries(scores).map(([key, value], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-warm-gray dark:text-warm-white-text mb-4 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-warm-gray/10 dark:text-warm-white-text/10"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - value / 100) }}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FF6B6B" />
                      <stop offset="100%" stopColor="#FFA94D" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold gradient-text">{value}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="w-6 h-6 text-coral" />
            <h2 className="text-2xl font-bold text-warm-gray dark:text-warm-white-text">
              Performance Over Time
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FFA94D" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="session" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#FF6B6B"
                strokeWidth={3}
                fill="url(#colorScore)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Question Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-warm-gray dark:text-warm-white-text mb-6">
            Question-by-Question Breakdown
          </h2>
          <div className="space-y-4">
            {questions.map((q) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="border border-white/20 dark:border-white/10 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedQuestion(expandedQuestion === q.id ? null : q.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-white/5 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1 text-left">
                    {getStatusIcon(q.status)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-semibold text-warm-gray dark:text-warm-white-text">
                          Question {q.id}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(q.status)}`}
                        >
                          {q.status === 'strong' ? '✅ Strong' : q.status === 'improve' ? '⚠️ Improve' : '❌ Weak'}
                        </span>
                        <span className="text-sm text-warm-gray/60 dark:text-warm-white-text/60">
                          {q.type}
                        </span>
                      </div>
                      <p className="text-warm-gray dark:text-warm-white-text">{q.question}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold gradient-text">{q.score}%</div>
                    </div>
                  </div>
                  {expandedQuestion === q.id ? (
                    <ChevronUp className="w-5 h-5 text-warm-gray dark:text-warm-white-text ml-4" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-warm-gray dark:text-warm-white-text ml-4" />
                  )}
                </button>
                {expandedQuestion === q.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6"
                  >
                    <div className="pt-4 border-t border-white/20 dark:border-white/10">
                      <p className="text-warm-gray/80 dark:text-warm-white-text/80 leading-relaxed">
                        {q.feedback}
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Lightbulb className="w-6 h-6 text-amber" />
            <h2 className="text-2xl font-bold text-warm-gray dark:text-warm-white-text">
              Suggestions for Improvement
            </h2>
          </div>
          <ul className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-start space-x-3 p-4 rounded-lg hover:bg-white/5 dark:hover:bg-white/5 transition-colors"
              >
                <CheckCircle2 className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" />
                <span className="text-warm-gray dark:text-warm-white-text">{suggestion}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-xl glass-card border border-white/20 dark:border-white/10 text-warm-gray dark:text-warm-white-text font-semibold flex items-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Save Progress</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-xl glass-card border border-white/20 dark:border-white/10 text-warm-gray dark:text-warm-white-text font-semibold flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Download PDF</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/upload')}
            className="px-6 py-3 rounded-xl glass-card border border-white/20 dark:border-white/10 text-warm-gray dark:text-warm-white-text font-semibold flex items-center space-x-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Retry Interview</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-coral to-peach text-white font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <BarChart3 className="w-5 h-5" />
            <span>Dashboard</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default FeedbackPage

