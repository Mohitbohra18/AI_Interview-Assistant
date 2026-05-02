import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Calendar,
  Award,
  Filter,
  Eye,
  ArrowRight,
  X,
  BarChart3,
  Activity,
  Target,
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

const DashboardPage = () => {
  const navigate = useNavigate()
  const [dateFilter, setDateFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const stats = [
    {
      label: 'Total Interviews',
      value: '12',
      icon: BarChart3,
      color: 'from-coral to-peach',
      trend: '+3 this month',
    },
    {
      label: 'Average Score',
      value: '82%',
      icon: Target,
      color: 'from-peach to-amber',
      trend: '+5% improvement',
    },
    {
      label: 'Improvement',
      value: '18%',
      icon: TrendingUp,
      color: 'from-amber to-coral',
      trend: 'Keep it up!',
    },
  ]

  const growthData = [
    { date: 'Jan', score: 65, verbal: 62, technical: 68 },
    { date: 'Feb', score: 72, verbal: 70, technical: 74 },
    { date: 'Mar', score: 78, verbal: 76, technical: 80 },
    { date: 'Apr', score: 82, verbal: 85, technical: 88 },
  ]

  const recentSessions = [
    {
      id: 1,
      date: '2024-04-15',
      type: 'Technical',
      score: 88,
      duration: '28 min',
    },
    {
      id: 2,
      date: '2024-04-12',
      type: 'HR / Behavioral',
      score: 82,
      duration: '25 min',
    },
    {
      id: 3,
      date: '2024-04-08',
      type: 'Behavioral',
      score: 78,
      duration: '30 min',
    },
    {
      id: 4,
      date: '2024-04-03',
      type: 'Technical',
      score: 75,
      duration: '32 min',
    },
  ]

  const interviewTypes = ['All', 'Technical', 'HR / Behavioral', 'Behavioral']

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-12"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-warm-gray dark:text-warm-white-text">Your </span>
              <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-xl text-warm-gray/70 dark:text-warm-white-text/70">
              Track your progress and see how you're improving
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/upload')}
            className="mt-4 md:mt-0 px-6 py-3 rounded-xl bg-gradient-to-r from-coral to-peach text-white font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <span>New Interview</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-sm font-medium text-warm-gray/70 dark:text-warm-white-text/70 mb-1">
                  {stat.label}
                </h3>
                <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
                <p className="text-sm text-warm-gray/60 dark:text-warm-white-text/60 flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>{stat.trend}</span>
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Growth Curve Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Activity className="w-6 h-6 text-coral" />
              <h2 className="text-2xl font-bold text-warm-gray dark:text-warm-white-text">
                Growth Curve
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 rounded-lg glass text-sm font-medium text-warm-gray dark:text-warm-white-text hover:bg-white/10">
                Overall
              </button>
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-warm-gray/50 dark:text-warm-white-text/50 hover:bg-white/5">
                Verbal
              </button>
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-warm-gray/50 dark:text-warm-white-text/50 hover:bg-white/5">
                Technical
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FFA94D" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorVerbal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFA94D" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FFA94D" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorTechnical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFB84D" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FFB84D" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#888" />
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
              <Area
                type="monotone"
                dataKey="verbal"
                stroke="#FFA94D"
                strokeWidth={2}
                fill="url(#colorVerbal)"
                strokeDasharray="5 5"
              />
              <Area
                type="monotone"
                dataKey="technical"
                stroke="#FFB84D"
                strokeWidth={2}
                fill="url(#colorTechnical)"
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Filters and Recent Sessions */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="w-5 h-5 text-coral" />
                <h3 className="text-lg font-bold text-warm-gray dark:text-warm-white-text">
                  Filters
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-warm-gray dark:text-warm-white-text mb-2">
                    Interview Type
                  </label>
                  <div className="space-y-2">
                    {interviewTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setTypeFilter(type.toLowerCase())}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                          typeFilter === type.toLowerCase()
                            ? 'bg-coral/20 text-coral font-semibold'
                            : 'glass text-warm-gray dark:text-warm-white-text hover:bg-white/10'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-warm-gray dark:text-warm-white-text mb-2">
                    Date Range
                  </label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg glass border border-white/20 dark:border-white/10 text-warm-gray dark:text-warm-white-text focus:outline-none focus:ring-2 focus:ring-coral"
                  >
                    <option value="all">All Time</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                  </select>
                </div>

                {(dateFilter !== 'all' || typeFilter !== 'all') && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setDateFilter('all')
                      setTypeFilter('all')
                    }}
                    className="w-full px-4 py-2 rounded-lg glass text-warm-gray dark:text-warm-white-text text-sm font-medium flex items-center justify-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Clear Filters</span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Recent Sessions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3"
          >
            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-warm-gray dark:text-warm-white-text">
                  Recent Sessions
                </h2>
                <Calendar className="w-5 h-5 text-coral" />
              </div>

              <div className="space-y-4">
                {recentSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-between p-6 rounded-xl border border-white/20 dark:border-white/10 hover:bg-white/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                    onClick={() => navigate('/feedback')}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-coral to-peach flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-semibold text-warm-gray dark:text-warm-white-text">
                            {session.type}
                          </span>
                          <span className="text-sm text-warm-gray/60 dark:text-warm-white-text/60">
                            {new Date(session.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-warm-gray/70 dark:text-warm-white-text/70">
                          <span>{session.duration}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 h-2 bg-warm-gray/10 dark:bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-coral to-peach rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${session.score}%` }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                              />
                            </div>
                            <span className="font-semibold gradient-text">{session.score}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg glass hover:bg-white/20 dark:hover:bg-white/10"
                    >
                      <Eye className="w-5 h-5 text-warm-gray dark:text-warm-white-text" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

