import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, Briefcase, Lock, CheckCircle2, Loader2, ArrowRight } from 'lucide-react'
import { useInterview } from '../contexts/InterviewContext'

const UploadPage = () => {
  const navigate = useNavigate()
  const { resumeFile, setResumeFile, jobFile, setJobFile, role, setRole, experience, setExperience } = useInterview()
  
  const [resumeProgress, setResumeProgress] = useState(0)
  const [jobProgress, setJobProgress] = useState(0)

  const handleFileDrop = (
    e: React.DragEvent,
    setFile: (file: File) => void,
    setProgress: (progress: number) => void
  ) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      setFile(file)
      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
        }
      }, 200)
    }
  }

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File) => void,
    setProgress: (progress: number) => void
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
        }
      }, 200)
    }
  }

  const canProceed = resumeFile && jobFile && resumeProgress === 100 && jobProgress === 100

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-warm-gray dark:text-warm-white-text">Upload Your </span>
            <span className="gradient-text">Resume & Job Description</span>
          </h1>
          <p className="text-xl text-warm-gray/70 dark:text-warm-white-text/70">
            Let's analyze your background and the role you're applying for
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Resume Upload */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-coral to-peach flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-warm-gray dark:text-warm-white-text">
                Your Resume
              </h2>
            </div>

            <div
              onDrop={(e) => handleFileDrop(e, setResumeFile, setResumeProgress)}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-coral/30 dark:border-coral/50 rounded-xl p-12 text-center hover:border-coral dark:hover:border-coral-light transition-colors cursor-pointer relative overflow-hidden group"
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileSelect(e, setResumeFile, setResumeProgress)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <AnimatePresence mode="wait">
                {resumeFile ? (
                  <motion.div
                    key="uploaded"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <CheckCircle2 className="w-16 h-16 text-coral mx-auto" />
                    <div>
                      <p className="font-semibold text-warm-gray dark:text-warm-white-text">
                        {resumeFile.name}
                      </p>
                      <p className="text-sm text-warm-gray/60 dark:text-warm-white-text/60 mt-1">
                        {(resumeFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    {resumeProgress < 100 && (
                      <div className="w-full bg-warm-gray/10 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-coral to-peach rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${resumeProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Upload className="w-16 h-16 text-coral mx-auto group-hover:scale-110 transition-transform" />
                    </motion.div>
                    <div>
                      <p className="font-semibold text-warm-gray dark:text-warm-white-text mb-2">
                        Drag & drop your resume here
                      </p>
                      <p className="text-sm text-warm-gray/60 dark:text-warm-white-text/60">
                        or click to browse (PDF, DOC, DOCX)
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Job Description Upload */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-peach to-amber flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-warm-gray dark:text-warm-white-text">
                Job Description
              </h2>
            </div>

            <div
              onDrop={(e) => handleFileDrop(e, setJobFile, setJobProgress)}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-peach/30 dark:border-peach/50 rounded-xl p-12 text-center hover:border-peach dark:hover:border-peach transition-colors cursor-pointer relative overflow-hidden group"
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => handleFileSelect(e, setJobFile, setJobProgress)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <AnimatePresence mode="wait">
                {jobFile ? (
                  <motion.div
                    key="uploaded"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <CheckCircle2 className="w-16 h-16 text-peach mx-auto" />
                    <div>
                      <p className="font-semibold text-warm-gray dark:text-warm-white-text">
                        {jobFile.name}
                      </p>
                      <p className="text-sm text-warm-gray/60 dark:text-warm-white-text/60 mt-1">
                        {(jobFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    {jobProgress < 100 && (
                      <div className="w-full bg-warm-gray/10 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-peach to-amber rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${jobProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                    >
                      <Upload className="w-16 h-16 text-peach mx-auto group-hover:scale-110 transition-transform" />
                    </motion.div>
                    <div>
                      <p className="font-semibold text-warm-gray dark:text-warm-white-text mb-2">
                        Drag & drop job description here
                      </p>
                      <p className="text-sm text-warm-gray/60 dark:text-warm-white-text/60">
                        or click to browse (PDF, DOC, DOCX, TXT)
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-8 mb-8"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-warm-gray dark:text-warm-white-text mb-2">
                Role / Position
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass border border-white/20 dark:border-white/10 text-warm-gray dark:text-warm-white-text focus:outline-none focus:ring-2 focus:ring-coral"
              >
                <option value="">Select role...</option>
                <option value="software-engineer">Software Engineer</option>
                <option value="product-manager">Product Manager</option>
                <option value="data-scientist">Data Scientist</option>
                <option value="designer">Designer</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-warm-gray dark:text-warm-white-text mb-2">
                Experience Level
              </label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass border border-white/20 dark:border-white/10 text-warm-gray dark:text-warm-white-text focus:outline-none focus:ring-2 focus:ring-coral"
              >
                <option value="">Select level...</option>
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="mid">Mid Level (3-5 years)</option>
                <option value="senior">Senior (6+ years)</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center space-x-2 mb-8"
        >
          <Lock className="w-5 h-5 text-coral" />
          <span className="text-sm text-warm-gray/70 dark:text-warm-white-text/70">
            🔒 Your data stays private and secure
          </span>
        </motion.div>

        {/* Generate Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={canProceed ? { scale: 1.05 } : {}}
            whileTap={canProceed ? { scale: 0.95 } : {}}
            onClick={() => canProceed && navigate('/loading')}
            disabled={!canProceed}
            className={`px-12 py-4 rounded-xl font-semibold text-lg flex items-center space-x-2 transition-all ${
              canProceed
                ? 'bg-gradient-to-r from-coral to-peach text-white shadow-lg hover:shadow-xl cursor-pointer'
                : 'bg-warm-gray/20 dark:bg-white/10 text-warm-gray/40 dark:text-warm-white-text/40 cursor-not-allowed'
            }`}
          >
            {canProceed ? (
              <>
                <span>Generate Interview Plan</span>
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Upload files to continue</span>
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default UploadPage

