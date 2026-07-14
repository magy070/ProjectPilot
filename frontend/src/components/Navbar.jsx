import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, LogOut, Settings, Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import Button from './Button.jsx';
import Logo from './Logo.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;
  
  const handleNavScroll = (e, targetId) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${targetId}`);
    }
  };

  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 ${
      isScrolled 
        ? 'border-b border-border bg-black/45 backdrop-blur-md shadow-warm' 
        : 'border-b border-transparent bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to={user ? "/dashboard" : "/"} className="flex items-center">
          <Logo size="md" showSubtitle={true} />
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-heading font-black tracking-wider uppercase">
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className={`${isActive('/dashboard') ? 'text-secondary font-black' : 'text-muted hover:text-text'} transition-colors relative py-1`}
              >
                Dashboard
                {isActive('/dashboard') && (
                  <motion.div layoutId="nav-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary" />
                )}
              </Link>
              <Link 
                to="/chat" 
                className={`${isActive('/chat') ? 'text-secondary font-black' : 'text-muted hover:text-text'} transition-colors relative py-1`}
              >
                AI Co-Pilot
                {isActive('/chat') && (
                  <motion.div layoutId="nav-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary" />
                )}
              </Link>
              <Link 
                to="/saved" 
                className={`${isActive('/saved') ? 'text-secondary font-black' : 'text-muted hover:text-text'} transition-colors relative py-1`}
              >
                Saved Projects
                {isActive('/saved') && (
                  <motion.div layoutId="nav-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary" />
                )}
              </Link>
              <Link 
                to="/profile" 
                className={`${isActive('/profile') ? 'text-secondary font-black' : 'text-muted hover:text-text'} transition-colors relative py-1`}
              >
                My Profile
                {isActive('/profile') && (
                  <motion.div layoutId="nav-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary" />
                )}
              </Link>
            </>
          ) : (
            <>
              <a 
                href="/#features" 
                onClick={(e) => handleNavScroll(e, 'features')} 
                className="text-muted hover:text-text transition-colors"
              >
                Features
              </a>
              <a 
                href="/#how-it-works" 
                onClick={(e) => handleNavScroll(e, 'how-it-works')} 
                className="text-muted hover:text-text transition-colors"
              >
                How It Works
              </a>
            </>
          )}
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-4">
          
          {/* Animated Sun / Moon Theme Toggler */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-card hover:bg-secondary/15 border border-border text-text transition-all duration-300 outline-none flex items-center justify-center cursor-pointer select-none"
            aria-label="Toggle Atmosphere"
            title={theme === 'dark' ? 'Switch to Los Santos Sunset' : 'Switch to Los Santos Night'}
          >
            <div className="relative w-5 h-5">
              <AnimatePresence mode="wait" initial={false}>
                {theme === 'dark' ? (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0 flex items-center justify-center text-secondary"
                  >
                    <Moon size={18} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0 flex items-center justify-center text-accent-orange"
                  >
                    <Sun size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </button>

          {/* User Auth actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted hidden lg:inline font-sans">
                  Wasted as <span className="text-secondary font-bold">{user.name}</span>
                </span>
                <Button variant="secondary" className="px-4 py-2 text-xs" onClick={handleLogout}>
                  <LogOut size={13} />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" className="px-4 py-2 text-xs" onClick={() => navigate('/auth?tab=login')}>
                  Login
                </Button>
                <Button variant="glow" className="px-4 py-2 text-xs" onClick={() => navigate('/auth?tab=register')}>
                  Get Started
                </Button>
              </>
            )}
          </div>

        </div>

      </div>
    </nav>
  );
}
