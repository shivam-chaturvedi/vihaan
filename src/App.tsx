import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { About } from './pages/About';
import { Dashboard } from './pages/Dashboard';
import { Landing } from './pages/Landing';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-stone-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <footer className="mt-auto border-t border-stone-200 bg-white py-8 text-stone-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p>© 2026 Project Pragya</p>
              <p className="mt-2 text-sm">किसानों के लिए सरल मापन, सलाह और खेत-स्तर मार्गदर्शन।</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
