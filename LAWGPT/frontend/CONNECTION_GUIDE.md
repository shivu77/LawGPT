# 🎨 LAW-GPT Frontend - Visual Guide & Connection Info

## 📸 UI Layout Overview

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER                                                      │
│ ⚖️ LAW-GPT        [Chat] [Stats] [History]                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ HERO SECTION                                                │
│ ⚖️ Indian Legal Assistant                                   │
│ 156K+ Legal Records • NVIDIA Llama 3.1 70B • Free & Fast   │
│                                                             │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐                       │
│ │ 156K+   │ │ NVIDIA  │ │ Multi-  │                       │
│ │ Records │ │ Llama   │ │ Domain  │                       │
│ └─────────┘ └─────────┘ └─────────┘                       │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐                       │
│ │ Hybrid  │ │ Multi-  │ │ Free &  │                       │
│ │ Search  │ │ Language│ │ Fast    │                       │
│ └─────────┘ └─────────┘ └─────────┘                       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ STATS STRIP                                                 │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│ │ 156K+   │ │ 0.95s   │ │ 95.0%   │ │ 3       │           │
│ │ DOCS    │ │ LATENCY │ │ ACCURACY│ │ LANGS   │           │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
├─────────────────────────────────────────────────────────────┤
│ CHAT INTERFACE (60/40 Split)                               │
│ ┌──────────────────────────────┐ ┌─────────────────┐    │
│ │ CHAT WINDOW                   │ │ QUICK EXAMPLES  │    │
│ │                               │ │                 │    │
│ │ [User] Question...            │ │ • IPC Section   │    │
│ │                               │ │ • Property law  │    │
│ │ [Bot] Answer...               │ │ • Consumer comp  │    │
│ │ ⏱ 0.95s 🌐 EN                 │ │ • Divorce       │    │
│ │                               │ │                 │    │
│ │ [Type question...] [Send]     │ │                 │    │
│ └──────────────────────────────┘ └─────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│ TABBED PANEL                                                 │
│ [OVERVIEW] [HISTORY] [SETTINGS]                             │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ Category Filters:                                     │   │
│ │ [All] [Property] [Criminal] [Family] [Corporate]...  │   │
│ └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
│ © 2025 LAW-GPT | Last updated: 5:47 PM                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔌 Backend Connection Details

### Backend API Endpoints

| Endpoint | Method | Purpose | Request Body | Response |
|----------|--------|---------|--------------|----------|
| `/api/query` | POST | Submit legal question | `{question, category?, target_language?}` | `{response: {answer, latency, system_info}, metrics}` |
| `/api/stats` | GET | Get system statistics | None | `{total_documents, avg_latency, accuracy}` |
| `/api/examples` | GET | Get example queries | None | `{examples: [...]}` |
| `/health` | GET | Health check | None | `{status: "ok"}` |

### Backend URL Configuration

**Default**: `http://localhost:5000`

Configure in `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

### API Integration File

**Location**: `frontend/src/api/client.js`

This file handles all API calls:
- ✅ Query submission
- ✅ Stats fetching
- ✅ Examples loading
- ✅ Health checks
- ✅ Error handling

---

## 🎨 Design Specifications

### Color Palette

| Element | Color | Hex |
|---------|-------|-----|
| Background | White | `#ffffff` |
| Primary Text | Dark Blue | `#0d1b26` |
| Secondary Text | Gray | `#6b7278` |
| Borders | Dark | `#0f1720` |
| Accent (Success) | Green | `#2cb67d` |
| Accent (Error) | Red | `#e25555` |

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Headings | Poppins | 48px → 32px | Bold |
| Body | Inter | 16px | Regular |
| Metrics | Roboto Mono | 24px+ | Bold |
| Labels | Inter | 13px | Medium (Uppercase) |

### Spacing & Layout

- **Container Max Width**: 1320px
- **Gap Between Elements**: 24px
- **Card Border Radius**: 12px
- **Card Shadow**: `0 4px 10px rgba(0,0,0,0.05)`
- **Hover Shadow**: `0 6px 14px rgba(0,0,0,0.08)`

---

## 📱 Responsive Behavior

### Desktop (> 1024px)
- Full 3-column layout
- Hero: 3×2 grid
- Chat: 60/40 split
- Stats: 4 columns

### Tablet (768px - 1024px)
- 2-column layout
- Hero: 2×3 grid
- Chat: Stacked
- Stats: 2×2 grid

### Mobile (< 768px)
- Single column
- Hero: 1×6 stack
- Chat: Full width
- Stats: 2×2 grid

---

## 🚀 Quick Start Commands

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:5000" > .env

# Start development server
npm run dev

# Build for production
npm run build
```

---

## ✅ Checklist for Frontend Developer

- [x] All React components created
- [x] Tailwind CSS configured
- [x] Design system colors applied
- [x] Typography system implemented
- [x] API client ready
- [x] Responsive breakpoints set
- [x] Animations & hover effects added
- [x] Category filtering implemented
- [x] Chat interface complete
- [x] Stats dashboard connected
- [x] Documentation complete

---

## 🎯 Key Features to Test

1. **Chat Interface**
   - Submit questions
   - View responses
   - Check latency display
   - Verify language detection

2. **Category Filtering**
   - Select different categories
   - Verify category is passed to API
   - Check active state styling

3. **Stats Dashboard**
   - Verify real-time updates
   - Check metric formatting
   - Test auto-refresh (30s)

4. **Responsive Design**
   - Test on mobile (< 768px)
   - Test on tablet (768-1024px)
   - Test on desktop (> 1024px)

5. **API Integration**
   - Test query submission
   - Verify error handling
   - Check loading states

---

## 📝 Notes

- All components follow the **Modern Minimal Data-Driven** design system
- No gradients or neon colors - clean, professional aesthetic
- Smooth animations on hover (translateY + shadow)
- Accessible markup with semantic HTML
- Production-ready code structure

---

**Status**: ✅ **READY FOR DEVELOPMENT**

Your frontend developer can now:
1. Install dependencies (`npm install`)
2. Start dev server (`npm run dev`)
3. Connect to backend API
4. Customize as needed

