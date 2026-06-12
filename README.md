# IoT Water Quality Monitoring System

A full-stack React + Vite (TypeScript) web application for monitoring water quality parameters in Makhana (Euryale ferox) pond farming. The system displays real-time sensor data from Firebase Realtime Database, helping farmers maintain optimal pond conditions and improve crop yield.

## Project Overview

**Project Name:** IOT device for detecting the water quality for better yield

**Use Case:** Makhana pond farming - monitoring water quality parameters to help farmers maintain optimal pond conditions and improve yield.

## Features

- **Real-time Dashboard**: Live monitoring of pH, ORP, TDS, Turbidity, and Temperature
- **Interactive Charts**: Visualize sensor data trends over time using Recharts
- **Historical Data**: View last 50 readings in a sortable table
- **Device Filtering**: Filter data by device ID
- **CSV Export**: Export sensor data for further analysis
- **Responsive Design**: Modern UI that works on all devices
- **Three Pages**: Landing page, Dashboard, and About page

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Firebase Realtime Database** (Web SDK v9 modular)
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons

## Firebase Configuration

The application connects to Firebase Realtime Database:
- **Database URL**: `https://vihan-garg-default-rtdb.firebaseio.com`
- **Data Path**: `/sensorData`
- Each reading is stored as a child node with an auto-generated pushId

### Sensor Data Structure

Each reading object contains:
- `deviceId` (string)
- `ts` (number) - timestamp
- `raw` (string) - raw sensor data
- `ph` (number | null)
- `ph_v` (number | null)
- `orp_raw` (number | null)
- `orp` (number | null)
- `tds` (number | null)
- `turb_adc` (number | null)
- `turb` (number | null)
- `turb_status` (string | null) - CLEAR/CLOUDY/DIRTY
- `temp_c` (number | null)

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation Steps

1. **Clone or navigate to the project directory**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory (already provided) with the following variables:
   ```
   VITE_FIREBASE_API_KEY=AIzaSyCnG_HsUlsGynaNucCq9fOdFuBNksC8c5A
   VITE_FIREBASE_AUTH_DOMAIN=vihan-garg.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://vihan-garg-default-rtdb.firebaseio.com
   VITE_FIREBASE_PROJECT_ID=vihan-garg
   VITE_FIREBASE_STORAGE_BUCKET=vihan-garg.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=850226774473
   VITE_FIREBASE_APP_ID=1:850226774473:web:ed66cee191952ba596a818
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the port shown in the terminal)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory. You can preview the production build with:

```bash
npm run preview
```

## Project Structure

```
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Navbar.tsx
│   │   ├── StatCard.tsx
│   │   ├── ChartPanel.tsx
│   │   ├── HistoryTable.tsx
│   │   └── StatusBadge.tsx
│   ├── pages/              # Page components
│   │   ├── Landing.tsx
│   │   ├── Dashboard.tsx
│   │   └── About.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── useSensorData.ts
│   ├── utils/              # Utility functions
│   │   ├── formatTime.ts
│   │   └── exportCsv.ts
│   ├── firebase.ts         # Firebase initialization
│   ├── types.ts            # TypeScript type definitions
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── .env                    # Environment variables
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## How It Works

1. **Data Flow**: Sensors → Arduino Nano → ESP Device → Firebase Realtime Database → Web Dashboard

2. **Data Fetching**: 
   - Uses Firebase Realtime Database query: `orderByChild("ts"), limitToLast(50)`
   - Subscribes to real-time updates using `onValue`
   - Converts object map to array and sorts by timestamp

3. **Latest Reading**: Determined as the record with maximum `ts` value

4. **Real-time Updates**: Dashboard automatically updates when new data arrives

## Pages

### Landing Page (`/`)
- Hero section with project description
- Problem statement
- Solution overview
- How it works (visual flow)
- Key benefits
- Call-to-action to dashboard

### Dashboard (`/dashboard`)
- Live summary cards for all parameters
- Turbidity status indicator
- Last updated timestamp
- Interactive line charts with toggleable parameters
- History table (last 50 readings)
- Device filter dropdown
- CSV export functionality
- Loading and error states

### About (`/about`)
- Explanation of each water quality parameter
- Typical ranges for Makhana ponds (informational only)
- System information
- Disclaimer about non-medical, non-guaranteed guidance

## Features in Detail

### Real-time Monitoring
- Automatically fetches and displays the latest 50 readings
- Updates in real-time as new data arrives
- Shows "Last updated" with relative time

### Data Visualization
- Interactive line charts using Recharts
- Toggle individual parameters on/off
- Shows trends over time
- Responsive chart sizing

### Data Export
- Export filtered or all data as CSV
- Includes all sensor parameters
- Timestamp formatted as ISO string

### Error Handling
- Loading states while fetching data
- Error messages for network/permission issues
- Empty state when no data is available
- Helpful user guidance

## Firebase Database Rules

Ensure your Firebase Realtime Database has appropriate read permissions. For development, you might use:

```json
{
  "rules": {
    "sensorData": {
      ".read": true,
      ".write": false
    }
  }
}
```

**Note**: Adjust rules for production based on your security requirements.

## Troubleshooting

### No Data Showing
- Ensure the ESP device is powered on and connected to Wi-Fi
- Verify Firebase Realtime Database rules allow read access
- Check browser console for errors
- Verify `.env` file has correct Firebase configuration

### Charts Not Displaying
- Ensure at least one reading exists in the database
- Check that sensor data has valid numeric values
- Verify Recharts is properly installed

### Build Errors
- Ensure all dependencies are installed: `npm install`
- Check TypeScript errors: `npm run build`
- Verify environment variables are set correctly

## License

This project is created for educational and agricultural monitoring purposes.

## Support

For issues or questions, please check:
- Firebase Console: https://console.firebase.google.com
- Firebase Documentation: https://firebase.google.com/docs
- React Documentation: https://react.dev

---

**Note**: This system is designed for monitoring purposes. The typical ranges provided are informational only and should not replace professional agricultural consultation.
