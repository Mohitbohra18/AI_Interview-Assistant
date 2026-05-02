import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Video,
  Mic,
  Pause,
  Settings,
  Repeat,
  ArrowRight,
} from 'lucide-react'
import { useInterview } from '../contexts/InterviewContext'

const InterviewRoom = () => {
  const navigate = useNavigate()
  const { sessionId, currentQuestion: contextQuestion, currentAudio, phase: contextPhase, scores, feedbacks, setScores, setFeedbacks } = useInterview()
  
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [totalQuestions] = useState(15) // Approx 10 tech + 5 beh
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [showPermissionModal, setShowPermissionModal] = useState(true)
  const [micLevel, setMicLevel] = useState(0)
  
  const [textAnswer, setTextAnswer] = useState('')
  const [aiText, setAiText] = useState('')
  const [phase, setPhase] = useState('intro')
  const [isLoading, setIsLoading] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const recognitionRef = useRef<any>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    let currentStream: MediaStream | null = null;
    async function setupCamera() {
      try {
        currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
    setupCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition && !recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscript) {
          setTextAnswer(prev => prev + finalTranscript);
        }
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Sync speech recognition state with recording state
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = () => {
        if (isRecording && !isPaused) {
          try { recognitionRef.current.start(); } catch (e) {}
        }
      };
      
      if (isRecording && !isPaused) {
        try { recognitionRef.current.start(); } catch (e) {}
      } else {
        recognitionRef.current.stop();
      }
    }
  }, [isRecording, isPaused]);

  useEffect(() => {
    if (!sessionId) {
      navigate('/upload')
      return
    }
  }, [sessionId, navigate])

  const playAudio = (base64Audio: string) => {
    if (audioRef.current) {
        audioRef.current.pause()
    }
    const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`)
    audio.play().catch(e => console.error("Audio playback failed", e))
    audioRef.current = audio
  }

  useEffect(() => {
    if (contextQuestion && currentQuestion === 1) {
       setAiText(contextQuestion)
       setPhase(contextPhase)
       if (currentAudio && !showPermissionModal) {
          playAudio(currentAudio)
       }
    }
  }, [contextQuestion, currentAudio, contextPhase, showPermissionModal])

  useEffect(() => {
    if (isRecording && !isPaused) {
      const timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
        setMicLevel(Math.random() * 100)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isRecording, isPaused])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleNext = async () => {
    if (!textAnswer.trim()) {
       alert("Please provide an answer before moving to the next question.")
       return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
           session_id: sessionId,
           user_answer: textAnswer
        })
      })
      
      const data = await response.json()
      
      if (data.score !== undefined) {
         setScores([...scores, data.score])
         setFeedbacks([...feedbacks, data.feedback])
      }
      
      if (data.is_ended || data.phase === 'ended') {
          navigate('/feedback')
      } else {
          setAiText(data.ai_text)
          setPhase(data.phase)
          if (data.audio_base64) {
             playAudio(data.audio_base64)
          }
          setTextAnswer('')
          setCurrentQuestion(prev => prev + 1)
          setTimeElapsed(0)
      }
    } catch (e) {
      console.error(e)
      alert("Failed to communicate with backend")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStart = () => {
    setShowPermissionModal(false)
    setIsRecording(true)
    
    if (currentAudio) {
      playAudio(currentAudio)
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <AnimatePresence>
        {showPermissionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card rounded-2xl p-8 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-coral to-peach flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🎥</span>
                </div>
                <h2 className="text-2xl font-bold text-warm-gray dark:text-warm-white-text mb-2">
                  Ready to Start?
                </h2>
                <p className="text-warm-gray/70 dark:text-warm-white-text/70">
                  Click 'Allow & Start' to begin the interview. The AI will start speaking immediately.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStart}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-coral to-peach text-white font-semibold"
                >
                  Allow & Start
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-6 h-[calc(100vh-8rem)]">
          {/* Left Panel - Question (60%) */}
          <div className="lg:col-span-3 flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-2xl p-8 flex-1 flex flex-col"
            >
              {/* Question Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="px-4 py-2 rounded-full bg-coral/10 dark:bg-coral/20 text-coral font-semibold">
                    Question {currentQuestion}
                  </div>
                  <div className="px-4 py-2 rounded-full glass text-warm-gray dark:text-warm-white-text text-sm font-medium">
                    {phase.toUpperCase()}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg glass hover:bg-white/20 dark:hover:bg-white/10"
                  onClick={() => audioRef.current?.play()}
                  title="Repeat Question"
                >
                  <Repeat className="w-5 h-5 text-warm-gray dark:text-warm-white-text" />
                </motion.button>
              </div>

              {/* Timer */}
              <div className="mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-32 h-32">
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
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - timeElapsed / 300)}`}
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - timeElapsed / 300) }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#FF6B6B" />
                          <stop offset="100%" stopColor="#FFA94D" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-warm-gray dark:text-warm-white-text">
                        {formatTime(timeElapsed)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question Text */}
              <div className="flex-1 overflow-auto">
                <motion.h2
                  key={currentQuestion}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl md:text-3xl font-bold text-warm-gray dark:text-warm-white-text leading-relaxed whitespace-pre-wrap"
                >
                  {aiText}
                </motion.h2>
              </div>
            </motion.div>
          </div>

          {/* Right Panel - Video & Controls (40%) */}
          <div className="lg:col-span-2 flex flex-col space-y-6">
            {/* Video Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-2xl p-6 flex-1 flex flex-col"
            >
              <div className="relative flex-1 rounded-xl overflow-hidden bg-warm-gray/10 dark:bg-white/10 mb-4">
                {/* Video placeholder (fallback) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Video className="w-16 h-16 text-warm-gray/30 dark:text-warm-white-text/30 mx-auto mb-2" />
                    <p className="text-warm-gray/50 dark:text-warm-white-text/50">
                      Video Preview
                    </p>
                  </div>
                </div>

                {/* Live Camera Feed */}
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline 
                  muted 
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />

                {/* Recording Indicator */}
                {isRecording && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-4 left-4 flex items-center space-x-2 px-4 py-2 rounded-full glass-card z-10"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-3 h-3 rounded-full bg-red-500"
                    />
                    <span className="text-sm font-semibold text-warm-gray dark:text-warm-white-text">
                      Recording
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Mic Level Visualizer */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 mb-2">
                  <Mic className="w-4 h-4 text-coral" />
                  <span className="text-sm text-warm-gray dark:text-warm-white-text">
                    Microphone Level
                  </span>
                </div>
                <div className="flex items-end space-x-1 h-12">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-coral via-peach to-amber rounded-t"
                      animate={{
                        height: `${(micLevel / 100) * 48 * Math.random()}px`,
                      }}
                      transition={{ duration: 0.1 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Text Input (Optional) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-4"
            >
              <textarea
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Type your answer here..."
                disabled={isLoading}
                className="w-full h-32 bg-transparent border border-white/20 dark:border-white/10 rounded-xl p-4 text-warm-gray dark:text-warm-white-text placeholder-warm-gray/40 dark:placeholder-warm-white-text/40 focus:outline-none focus:ring-2 focus:ring-coral resize-none disabled:opacity-50"
              />
            </motion.div>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-4 mt-6"
        >
          <div className="flex items-center justify-between">
            {/* Progress Dots */}
            <div className="flex items-center space-x-2">
              {[...Array(totalQuestions)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i < currentQuestion
                      ? 'bg-coral'
                      : i === currentQuestion - 1
                      ? 'bg-coral ring-2 ring-coral/50'
                      : 'bg-warm-gray/20 dark:bg-white/20'
                  }`}
                />
              ))}
            </div>

            {/* Control Buttons */}
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsPaused(!isPaused)}
                className="p-3 rounded-xl glass hover:bg-white/20 dark:hover:bg-white/10"
              >
                <Pause className="w-5 h-5 text-warm-gray dark:text-warm-white-text" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-xl glass hover:bg-white/20 dark:hover:bg-white/10"
              >
                <Settings className="w-5 h-5 text-warm-gray dark:text-warm-white-text" />
              </motion.button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (window.confirm("Are you sure you want to end the interview early?")) {
                    navigate('/feedback')
                  }
                }}
                className="px-6 py-3 rounded-xl border-2 border-red-400 text-red-500 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                End Interview
              </motion.button>

              <motion.button
                whileHover={isLoading ? {} : { scale: 1.05 }}
                whileTap={isLoading ? {} : { scale: 0.95 }}
                onClick={handleNext}
                disabled={isLoading}
                className={`px-8 py-3 rounded-xl bg-gradient-to-r from-coral to-peach text-white font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-shadow ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <span>{isLoading ? 'Processing...' : 'Submit & Next'}</span>
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default InterviewRoom
