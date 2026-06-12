import { Droplet, Activity, Thermometer, Gauge, Eye, AlertTriangle } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Water Quality Monitoring</h1>
          <p className="text-lg text-gray-700 mb-6">
            This system monitors critical water quality parameters for Makhana (Euryale ferox) pond farming. 
            Understanding these parameters helps farmers maintain optimal pond conditions and improve crop yield.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <p className="text-sm text-blue-800">
                <strong>Disclaimer:</strong> The typical ranges provided below are for informational purposes only 
                and are not medical or agricultural guarantees. Actual optimal ranges may vary based on specific 
                pond conditions, local climate, and farming practices. Always consult with agricultural experts 
                for your specific situation.
              </p>
            </div>
          </div>
        </div>

        {/* pH Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 rounded-lg p-3 mr-4">
              <Droplet className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">pH Level</h2>
          </div>
          <p className="text-gray-700 mb-4">
            pH measures the acidity or alkalinity of water on a scale of 0-14. For Makhana ponds, maintaining 
            the right pH is crucial for plant health and nutrient availability.
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Typical Range for Makhana Ponds:</h3>
            <p className="text-gray-700">
              <strong>6.5 - 8.5</strong> (slightly acidic to slightly alkaline)
            </p>
            <p className="text-sm text-gray-600 mt-2">
              pH levels outside this range can affect nutrient availability and plant growth. Regular monitoring 
              helps identify pH fluctuations early.
            </p>
          </div>
        </div>

        {/* ORP Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 rounded-lg p-3 mr-4">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">ORP (Oxidation-Reduction Potential)</h2>
          </div>
          <p className="text-gray-700 mb-4">
            ORP measures the water's ability to oxidize or reduce substances, indicating the presence of 
            oxidizing or reducing agents. It's an important indicator of water quality and potential for 
            organic matter breakdown.
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Typical Range for Makhana Ponds:</h3>
            <p className="text-gray-700">
              <strong>200 - 400 mV</strong> (millivolts)
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Higher ORP values generally indicate better water quality with good oxygen levels. Lower values 
              may suggest organic matter buildup or reduced oxygen.
            </p>
          </div>
        </div>

        {/* TDS Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-yellow-100 rounded-lg p-3 mr-4">
              <Gauge className="h-6 w-6 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">TDS (Total Dissolved Solids)</h2>
          </div>
          <p className="text-gray-700 mb-4">
            TDS measures the total concentration of dissolved substances in water, including minerals, salts, 
            and organic matter. It's an indicator of water purity and nutrient content.
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Typical Range for Makhana Ponds:</h3>
            <p className="text-gray-700">
              <strong>100 - 500 ppm</strong> (parts per million)
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Moderate TDS levels are generally acceptable. Very high TDS may indicate excessive mineral 
              content, while very low TDS might suggest insufficient nutrients.
            </p>
          </div>
        </div>

        {/* Turbidity Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 rounded-lg p-3 mr-4">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Turbidity</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Turbidity measures the cloudiness or haziness of water caused by suspended particles. Clear water 
            allows better light penetration, which is important for aquatic plant growth.
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Typical Range for Makhana Ponds:</h3>
            <p className="text-gray-700">
              <strong>0 - 10 NTU</strong> (Nephelometric Turbidity Units) - Clear to slightly cloudy
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Status indicators:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-2 ml-4">
              <li><strong>CLEAR:</strong> Optimal conditions, good light penetration</li>
              <li><strong>CLOUDY:</strong> Moderate suspended particles, monitor closely</li>
              <li><strong>DIRTY:</strong> High turbidity, may need intervention</li>
            </ul>
          </div>
        </div>

        {/* Temperature Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 rounded-lg p-3 mr-4">
              <Thermometer className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Temperature</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Water temperature affects plant growth, metabolic rates, and oxygen solubility. Maintaining 
            appropriate temperature is crucial for optimal Makhana development.
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Typical Range for Makhana Ponds:</h3>
            <p className="text-gray-700">
              <strong>20 - 30°C</strong> (68 - 86°F)
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Makhana plants thrive in warm water. Temperature affects flowering, seed development, and overall 
              growth rates. Monitor for sudden changes that might indicate issues.
            </p>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">System Information</h2>
          <p className="text-gray-700 mb-4">
            This IoT water quality monitoring system uses sensors connected to an Arduino Nano, which processes 
            the data and transmits it via an ESP device to Firebase Realtime Database. The dashboard displays 
            real-time readings and historical trends to help farmers make informed decisions.
          </p>
          <p className="text-gray-700">
            The system monitors up to 50 recent readings and updates automatically as new data arrives from 
            the sensor device. Data can be exported as CSV for further analysis.
          </p>
        </div>
      </div>
    </div>
  );
}
