import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Chatbot } from './components/Chatbot';
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
        <footer className="mt-auto border-t border-stone-200 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-medium text-stone-600">© 2026 Project Pragya</p>
            <p className="mt-1 text-sm text-stone-400">किसानों के लिए सरल मापन, सलाह और खेत-स्तर मार्गदर्शन।</p>
          </div>
        </footer>
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
