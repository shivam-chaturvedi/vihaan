import { Link, useLocation } from 'react-router-dom';
import { Menu, Sprout, X } from 'lucide-react';
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

  const linkClass = (path: string) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive(path) ? 'bg-emerald-50 text-emerald-700' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-stone-200 bg-stone-50/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5" onClick={() => setMobileMenuOpen(false)}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600">
              <Sprout className="h-5 w-5 text-white" />
            </div>
            <span className="text-base font-semibold tracking-tight text-stone-900">Project Pragya</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} className={linkClass(item.path)}>
                {item.label}
              </Link>
            ))}
          </div>

          <button
            className="rounded-lg p-2 text-stone-600 hover:bg-stone-100 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="मेन्यू"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="space-y-1 pb-4 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block ${linkClass(item.path)}`}
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
