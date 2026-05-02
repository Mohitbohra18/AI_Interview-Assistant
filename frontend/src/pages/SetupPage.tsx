import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Code, Users, Brain, Video, Mic, Type, Clock, Play, Sliders } from 'lucide-react'

const SetupPage = () => {
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState<string>('')
  const [mode, setMode] = useState<'video' | 'audio' | 'text'>('video')
  const [difficulty, setDifficulty] = useState(5)

  const interviewTypes = [
    {
      id: 'technical',
      title: 'Technical',
      icon: Code,
      color: 'from-coral to-peach',
      description: 'Coding challenges and technical problem-solving',
    },
    {
      id: 'hr',
      title: 'HR / Behavioral',
      icon: Users,
      color: 'from-peach to-amber',
      description: 'Soft skills and cultural fit questions',
    },
    {
      id: 'behavioral',
      title: 'Behavioral',
      icon: Brain,
      color: 'from-amber to-coral',
      description: 'STAR method and situational questions',
    },
  ]

  const modes = [
    { id: 'video', label: 'Video', icon: Video },
    { id: 'audio', label: 'Audio', icon: Mic },
    { id: 'text', label: 'Text', icon: Type },
  ]

  const handleStart = () => {
    if (selectedType) {
      navigate('/loading')
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-warm-gray dark:text-warm-white-text">Set Up Your </span>
            <span className="gradient-text">Interview</span>
          </h1>
          <p className="text-xl text-warm-gray/70 dark:text-warm-white-text/70">
            Choose your interview type and preferences
          </p>
        </motion.div>

        {/* Interview Type Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-warm-gray dark:text-warm-white-text mb-6">
            Interview Type
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {interviewTypes.map((type) => {
              const Icon = type.icon
              const isSelected = selectedType === type.id
              return (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedType(type.id)}
                  className={`glass-card rounded-2xl p-6 text-left transition-all ${
                    isSelected
                      ? 'ring-4 ring-coral/50 dark:ring-coral/70 shadow-2xl'
                      : 'hover:shadow-xl'
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-warm-gray dark:text-warm-white-text mb-2">
                    {type.title}
                  </h3>
                  <p className="text-sm text-warm-gray/70 dark:text-warm-white-text/70">
                    {type.description}
                  </p>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-4 flex items-center space-x-2 text-coral"
                    >
                      <div className="w-2 h-2 rounded-full bg-coral" />
                      <span className="text-sm font-semibold">Selected</span>
                    </motion.div>
                  )}
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Mode Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Sliders className="w-6 h-6 text-coral" />
            <h2 className="text-2xl font-bold text-warm-gray dark:text-warm-white-text">
              Interview Mode
            </h2>
          </div>
          <div className="flex flex-wrap gap-4">
            {modes.map((modeOption) => {
              const Icon = modeOption.icon
              const isSelected = mode === modeOption.id
              return (
                <motion.button
                  key={modeOption.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMode(modeOption.id as 'video' | 'audio' | 'text')}
                  className={`flex items-center space-x-3 px-6 py-4 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-coral to-peach text-white shadow-lg'
                      : 'glass-card text-warm-gray dark:text-warm-white-text hover:bg-white/20 dark:hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold">{modeOption.label}</span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Difficulty Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-warm-gray dark:text-warm-white-text">
              Difficulty Level
            </h2>
            <span className="text-2xl font-bold gradient-text">{difficulty}/10</span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="1"
              max="10"
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="w-full h-3 bg-warm-gray/10 dark:bg-white/10 rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #FF6B6B 0%, #FFA94D ${(difficulty / 10) * 100}%, rgba(45, 52, 54, 0.1) ${(difficulty / 10) * 100}%)`,
              }}
            />
            <div className="flex justify-between mt-2 text-sm text-warm-gray/60 dark:text-warm-white-text/60">
              <span>Easy</span>
              <span>Medium</span>
              <span>Hard</span>
            </div>
          </div>
        </motion.div>

        {/* Estimated Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center space-x-2 mb-8"
        >
          <Clock className="w-5 h-5 text-coral" />
          <span className="text-warm-gray dark:text-warm-white-text">
            Estimated time: <span className="font-semibold">25-30 minutes</span>
          </span>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={selectedType ? { scale: 1.05 } : {}}
            whileTap={selectedType ? { scale: 0.95 } : {}}
            onClick={handleStart}
            disabled={!selectedType}
            className={`px-12 py-4 rounded-xl font-semibold text-lg flex items-center space-x-2 transition-all ${
              selectedType
                ? 'bg-gradient-to-r from-coral to-peach text-white shadow-lg hover:shadow-xl cursor-pointer'
                : 'bg-warm-gray/20 dark:bg-white/10 text-warm-gray/40 dark:text-warm-white-text/40 cursor-not-allowed'
            }`}
          >
            <Play className="w-5 h-5" />
            <span>Start Interview</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default SetupPage

