import { Link, useLocation } from 'react-router-dom';
import { Menu, Sprout } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'परिचय' },
    { path: '/dashboard', label: 'डैशबोर्ड' },
    { path: '/about', label: 'जानकारी' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-2">
              <Sprout className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-900">Project Pragya</p>
              <p className="text-xs text-stone-500">पानी, मिट्टी, तालाब और पोषक तत्व मापन</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.path) ? 'bg-stone-100 text-stone-900' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button
            className="rounded-md p-2 text-stone-600 hover:bg-stone-100 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="space-y-2 pb-4 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block rounded-md px-3 py-2 text-base font-medium ${
                  isActive(item.path) ? 'bg-stone-100 text-stone-900' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
