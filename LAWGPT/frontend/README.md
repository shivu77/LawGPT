# 🎨 LAW-GPT Frontend

Professional, modern, minimal UI/UX for LAW-GPT Legal Assistant built with React + Tailwind CSS.

## 🎯 Design System

Following the **Modern Minimal Data-Driven Design System**:

- **Background**: Pure white (#ffffff)
- **Text**: Dark (#0d1b26 primary, #6b7278 secondary)
- **Borders**: 2px solid (#0f1720)
- **Cards**: 12px rounded corners, subtle shadows
- **Typography**: Poppins (headings), Inter (body), Roboto Mono (metrics)
- **Layout**: Clean grid-aligned, 24px gaps, 1320px max width

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running on `http://localhost:5000`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Top navigation
│   │   ├── Hero.jsx            # Hero section with features
│   │   ├── StatsStrip.jsx      # Metrics dashboard
│   │   ├── ChatInterface.jsx   # Main chat UI
│   │   ├── TabbedPanel.jsx     # Overview/History/Settings tabs
│   │   ├── CategoryFilter.jsx  # Legal category filters
│   │   └── Footer.jsx          # Footer
│   ├── api/
│   │   └── client.js           # API integration
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles & Tailwind
├── index.html                  # HTML template
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind configuration
├── vite.config.js              # Vite configuration
└── README.md                   # This file
```

## 🔌 API Integration

The frontend connects to the backend API endpoints:

- **POST** `/api/query` - Submit legal questions
- **GET** `/api/stats` - Get system statistics
- **GET** `/api/examples` - Get example queries
- **GET** `/health` - Health check

### Configuration

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

## ✨ Features

### 🎨 UI Components

1. **Header** - Minimal navigation with logo
2. **Hero Section** - Feature grid (3×2 layout)
3. **Stats Strip** - Real-time metrics (Documents, Latency, Accuracy, Languages)
4. **Chat Interface** - 
   - Left: Chat window (60% width)
   - Right: Quick examples sidebar (40% width)
   - Language detection indicator
   - Response latency display
5. **Tabbed Panel** - 
   - **Overview**: Category filtering
   - **History**: Query history (coming soon)
   - **Settings**: Language preferences
6. **Footer** - Last updated timestamp

### 🎯 Features

- ✅ Real-time chat interface
- ✅ Category filtering (Property, Criminal, Family, Corporate, etc.)
- ✅ Multi-language support (English, Hindi, Tamil)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth animations and hover effects
- ✅ Professional typography and spacing
- ✅ Accessible markup

## 🎨 Design Principles

1. **Minimal & Clean** - No clutter, focus on clarity
2. **Data-Driven** - Metrics and stats prominently displayed
3. **Professional** - Premium, analytical, intelligent feel
4. **Responsive** - Works on all screen sizes
5. **Accessible** - Semantic HTML, proper contrast

## 🔧 Customization

### Colors

Edit `tailwind.config.js`:

```js
colors: {
  primary: {
    text: '#0d1b26',
    textSecondary: '#6b7278',
    border: '#0f1720',
    accent: {
      positive: '#2cb67d',
      negative: '#e25555',
    }
  },
}
```

### Typography

Fonts are loaded from Google Fonts in `index.html`:
- Poppins (headings)
- Inter (body)
- Roboto Mono (metrics)

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (stacked layout)
- **Tablet**: 768px - 1024px (2-column grid)
- **Desktop**: > 1024px (full 3-column layout)

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

### Deploy to Vercel/Netlify

1. Connect your repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Set environment variable: `VITE_API_URL=<your-backend-url>`

## 🐛 Troubleshooting

### API Connection Issues

1. Ensure backend is running on `http://localhost:5000`
2. Check `.env` file has correct `VITE_API_URL`
3. Check browser console for CORS errors
4. Verify backend API endpoints are accessible

### Styling Issues

1. Clear browser cache
2. Rebuild Tailwind: `npm run build`
3. Check `tailwind.config.js` content paths

## 📄 License

Part of LAW-GPT project.

## 👥 Credits

- Design System: Modern Minimal Data-Driven UI
- Framework: React + Vite
- Styling: Tailwind CSS
- Icons: Lucide React

