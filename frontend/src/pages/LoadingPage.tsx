import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useInterview } from '../contexts/InterviewContext'

const LoadingPage = () => {
  const navigate = useNavigate()
  const { resumeFile, jobFile, role, experience, setSessionId, setCurrentQuestion, setCurrentAudio, setPhase } = useInterview()
  const [currentStep, setCurrentStep] = useState(0)
  const [apiDone, setApiDone] = useState(false)

  const steps = [
    { id: 1, text: 'Analyzing resume...', duration: 2000 },
    { id: 2, text: 'Understanding job role...', duration: 2000 },
    { id: 3, text: 'Crafting personalized questions...', duration: 2000 },
    { id: 4, text: 'Preparing interview environment...', duration: 1500 },
  ]

  useEffect(() => {
    const initializeInterview = async () => {
      try {
        if (!resumeFile || !jobFile) {
           console.warn("Missing files!")
           setTimeout(() => navigate('/upload'), 2000)
           return
        }
        
        const formData = new FormData()
        formData.append('resume', resumeFile)
        formData.append('job_description_file', jobFile)
        formData.append('role', role)
        formData.append('experience', experience)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (response.ok) {
           const data = await response.json()
           setSessionId(data.session_id)
           setCurrentQuestion(data.initial_question)
           setCurrentAudio(data.audio_base64)
           setPhase(data.phase)
           setApiDone(true)
        } else {
           console.error("Failed to init API: ", await response.text());
        }
      } catch (err) {
        console.error("API error", err)
      }
    }
    
    initializeInterview()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length) return prev;
        return prev + 1;
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [steps.length])

  useEffect(() => {
    if (apiDone) {
      // Force step completion visually right before navigating
      setCurrentStep(steps.length)
      navigate('/interview')
    }
  }, [apiDone, navigate, steps.length])

  const progress = apiDone ? 100 : Math.min(95, ((currentStep / steps.length) * 100).toFixed(0))

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-coral/20 dark:bg-coral/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-peach/20 dark:bg-peach/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Animated Avatar */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-12"
        >
          <div className="w-48 h-48 md:w-64 md:h-64 mx-auto rounded-full bg-gradient-to-br from-coral via-peach to-amber flex items-center justify-center shadow-2xl relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative z-10 text-8xl"
            >
              🤔
            </motion.div>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <div className="space-y-4 mb-8">
          <AnimatePresence mode="wait">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep
              const isCurrent = index === currentStep - 1

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`flex items-center justify-center space-x-4 p-4 rounded-xl ${
                    isCompleted
                      ? 'glass-card'
                      : isCurrent
                      ? 'glass-card ring-2 ring-coral'
                      : 'opacity-50'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-coral flex-shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-6 h-6 text-coral animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-warm-gray/30 dark:border-warm-white-text/30 flex-shrink-0" />
                  )}
                  <span
                    className={`text-lg font-medium ${
                      isCompleted || isCurrent
                        ? 'text-warm-gray dark:text-warm-white-text'
                        : 'text-warm-gray/50 dark:text-warm-white-text/50'
                    }`}
                  >
                    {step.text}
                  </span>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-warm-gray/10 dark:bg-white/10 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-coral via-peach to-amber rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Progress Percentage */}
        <motion.div
          key={progress}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-3xl font-bold gradient-text"
        >
          {progress}%
        </motion.div>
      </div>
    </div>
  )
}

export default LoadingPage

