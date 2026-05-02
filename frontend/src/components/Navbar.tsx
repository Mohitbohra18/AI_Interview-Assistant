import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sun, Moon, User, Home, FileText, BarChart3 } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const Navbar = () => {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/upload', label: 'New Interview', icon: FileText },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 glass-card border-b border-white/20 dark:border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-coral to-peach flex items-center justify-center"
            >
              <span className="text-white font-bold text-xl">AI</span>
            </motion.div>
            <span className="font-clash text-xl font-bold gradient-text hidden sm:block">
              Interview Coach
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                    isActive
                      ? 'text-coral dark:text-coral-light'
                      : 'text-warm-gray dark:text-warm-white-text hover:text-coral dark:hover:text-coral-light'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-coral/10 dark:bg-coral/20 rounded-lg"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10 font-medium">{link.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9, rotate: 180 }}
              onClick={toggleTheme}
              className="p-2 rounded-full glass hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-warm-gray dark:text-warm-white-text" />
              ) : (
                <Sun className="w-5 h-5 text-warm-white-text" />
              )}
            </motion.button>

            {/* User Avatar */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full glass hover:bg-white/20 dark:hover:bg-white/10"
            >
              <User className="w-5 h-5 text-warm-gray dark:text-warm-white-text" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-white/20 dark:border-white/10">
        <div className="flex items-center justify-around py-2">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'text-coral dark:text-coral-light'
                    : 'text-warm-gray dark:text-warm-white-text'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{link.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar

