import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Button from './Button.jsx';
import Logo from './Logo.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
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

  return (
    <nav className="border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-40 w-full">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to={user ? "/dashboard" : "/"}>
          <Logo size="md" showSubtitle={true} />
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className={`${isActive('/dashboard') ? 'text-primary' : 'text-muted hover:text-white'} transition-colors`}
              >
                Dashboard
              </Link>
              <Link 
                to="/chat" 
                className={`${isActive('/chat') ? 'text-primary' : 'text-muted hover:text-white'} transition-colors`}
              >
                AI Co-Pilot
              </Link>
              <Link 
                to="/saved" 
                className={`${isActive('/saved') ? 'text-primary' : 'text-muted hover:text-white'} transition-colors`}
              >
                Saved Projects
              </Link>
              <Link 
                to="/profile" 
                className={`${isActive('/profile') ? 'text-primary' : 'text-muted hover:text-white'} transition-colors`}
              >
                My Profile
              </Link>
            </>
          ) : (
            <>
              <a 
                href="/#features" 
                onClick={(e) => handleNavScroll(e, 'features')} 
                className="text-muted hover:text-white transition-colors"
              >
                Features
              </a>
              <a 
                href="/#how-it-works" 
                onClick={(e) => handleNavScroll(e, 'how-it-works')} 
                className="text-muted hover:text-white transition-colors"
              >
                How It Works
              </a>
            </>
          )}
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted hidden sm:inline font-mono">
                Logged in as <span className="text-white font-semibold">{user.name}</span>
              </span>
              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/auth?tab=login')}>
                Login
              </Button>
              <Button variant="primary" onClick={() => navigate('/auth?tab=register')}>
                Get Started
              </Button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
