import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { InterviewProvider } from './contexts/InterviewContext'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import UploadPage from './pages/UploadPage'
import LoadingPage from './pages/LoadingPage'
import InterviewRoom from './pages/InterviewRoom'
import FeedbackPage from './pages/FeedbackPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  return (
    <ThemeProvider>
      <InterviewProvider>
      <Router>
        <div className="min-h-screen bg-cream dark:bg-charcoal transition-colors duration-300">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/loading" element={<LoadingPage />} />
            <Route path="/interview" element={<InterviewRoom />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </div>
      </Router>
      </InterviewProvider>
    </ThemeProvider>
  )
}

export default App

