import { Link } from 'react-router-dom';
import { Droplet, Activity, Wifi, Database, BarChart3, CheckCircle, ArrowRight } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Water Quality Monitoring for
            <span className="text-blue-600 block mt-2">Better Makhana Yield</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Real-time monitoring of pond water quality parameters to help farmers maintain optimal conditions 
            and maximize their Makhana (Euryale ferox) crop yield.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            View Live Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Problem Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Challenge</h2>
          <p className="text-lg text-gray-700 mb-4">
            Makhana farming requires precise water quality management. Traditional methods of monitoring 
            pond conditions are time-consuming, inaccurate, and reactive rather than proactive. Poor water 
            quality can lead to:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Reduced crop yield and quality</li>
            <li>Increased disease susceptibility</li>
            <li>Higher production costs</li>
            <li>Delayed response to water quality issues</li>
          </ul>
        </div>
      </section>

      {/* Solution Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">Our Solution</h2>
          <p className="text-lg mb-6">
            An IoT-based water quality monitoring system that provides real-time data on critical parameters 
            including pH, ORP (Oxidation-Reduction Potential), TDS (Total Dissolved Solids), Turbidity, and 
            Temperature. Farmers can access this data anytime, anywhere through a web dashboard.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <Activity className="h-10 w-10 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Real-Time Monitoring</h3>
              <p className="text-blue-100">Continuous 24/7 monitoring of water quality parameters</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <BarChart3 className="h-10 w-10 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Data Visualization</h3>
              <p className="text-blue-100">Interactive charts and historical data analysis</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <CheckCircle className="h-10 w-10 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Access</h3>
              <p className="text-blue-100">View data from any device with internet connection</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How It Works</h2>
        <div className="grid md:grid-cols-5 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Droplet className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Sensors</h3>
            <p className="text-sm text-gray-600">Measure water quality parameters</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Activity className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Arduino Nano</h3>
            <p className="text-sm text-gray-600">Processes sensor data</p>
          </div>
          <div className="text-center">
            <div className="bg-yellow-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Wifi className="h-10 w-10 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">ESP Device</h3>
            <p className="text-sm text-gray-600">Transmits data wirelessly</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Database className="h-10 w-10 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Firebase</h3>
            <p className="text-sm text-gray-600">Cloud database storage</p>
          </div>
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <BarChart3 className="h-10 w-10 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Dashboard</h3>
            <p className="text-sm text-gray-600">Real-time visualization</p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Key Benefits</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Improved Yield', desc: 'Maintain optimal conditions for maximum crop production' },
            { title: 'Cost Savings', desc: 'Reduce losses from poor water quality issues' },
            { title: 'Early Detection', desc: 'Identify problems before they impact your crop' },
            { title: 'Data-Driven Decisions', desc: 'Make informed decisions based on real-time data' },
            { title: 'Remote Monitoring', desc: 'Monitor your ponds from anywhere' },
            { title: 'Historical Analysis', desc: 'Track trends and patterns over time' },
          ].map((benefit, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <CheckCircle className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Makhana Yield?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Start monitoring your pond water quality today
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
