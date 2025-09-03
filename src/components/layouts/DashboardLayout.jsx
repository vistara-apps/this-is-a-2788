import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Camera, 
  Grid, 
  Image, 
  User, 
  CreditCard, 
  Eye, 
  LogOut, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';

function DashboardLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Grid className="h-5 w-5" /> },
    { name: 'Galleries', path: '/galleries', icon: <Image className="h-5 w-5" /> },
    { name: 'Preview', path: '/preview', icon: <Eye className="h-5 w-5" /> },
    { name: 'Subscription', path: '/subscription', icon: <CreditCard className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* Top navigation */}
      <nav className="gradient-bg text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <Camera className="h-8 w-8" />
                <span className="text-xl font-bold">Petfolio</span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      isActive
                        ? 'bg-white bg-opacity-20 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2'
                        : 'text-white hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors duration-200'
                    }
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </div>
            </div>

            {/* User menu */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center">
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 bg-white bg-opacity-10 px-3 py-2 rounded-md text-sm font-medium hover:bg-opacity-20 transition-colors duration-200"
                  >
                    <User className="h-5 w-5" />
                    <span>{user?.email}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {userMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1">
                        <Link
                          to="/account"
                          className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Account Settings
                        </Link>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            handleSignOut();
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-gray-100"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white hover:bg-opacity-10 focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-white bg-opacity-20 text-white block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2'
                      : 'text-white hover:bg-white hover:bg-opacity-10 block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2'
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              ))}
              <Link
                to="/account"
                className="text-white hover:bg-white hover:bg-opacity-10 block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span>Account</span>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignOut();
                }}
                className="text-white hover:bg-white hover:bg-opacity-10 w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Camera className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-text-primary">Petfolio</span>
            </div>
            <div className="text-text-secondary text-sm">
              &copy; {new Date().getFullYear()} Petfolio. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default DashboardLayout;

