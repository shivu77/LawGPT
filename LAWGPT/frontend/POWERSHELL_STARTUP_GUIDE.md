# Frontend Startup Guide - PowerShell Fix

## ✅ Issue Fixed

**Problem**: PowerShell doesn't support `&&` operator like bash does.

**Error**: 
```
The token '&&' is not a valid statement separator in this version.
```

**Solution**: Use PowerShell-compatible syntax:
- Use `;` instead of `&&` for command chaining
- Or use separate commands
- Or use the provided startup scripts

## 🚀 How to Start Frontend

### Option 1: Using PowerShell Script (Recommended)
```powershell
.\start-dev.ps1
```

### Option 2: Using Batch File
```cmd
start-dev.bat
```

### Option 3: Manual PowerShell Commands
```powershell
cd frontend
npm run dev
```

### Option 4: Single Line (PowerShell)
```powershell
cd frontend; npm run dev
```

## ✅ Status

- ✅ Frontend server is running on **http://localhost:3001**
- ✅ Configuration files are correct
- ✅ Environment variables configured (API defaults to `http://localhost:5000`)
- ✅ Dependencies installed
- ✅ No linting errors

## 📝 Notes

- The dev server is configured to run on port **3001** (not 3000)
- API proxy is configured for `/api` routes to `http://localhost:5000`
- The server will automatically open in your browser when started
- Use `Ctrl+C` to stop the server

## 🔧 Configuration Files

- `vite.config.js` - Vite configuration (port 3001, proxy setup)
- `.env` - Environment variables (optional, API URL defaults to `http://localhost:5000`)
- `package.json` - Dependencies and scripts
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration

## 🌐 Access the Application

Once the server is running, open your browser and navigate to:
**http://localhost:3001**

## 🔍 Troubleshooting

### Port Already in Use
If port 3001 is already in use, you can:
1. Stop the existing process: `netstat -ano | findstr :3001`
2. Or change the port in `vite.config.js`

### API Connection Issues
Make sure your backend is running on `http://localhost:5000` or update the API URL in:
- `frontend/.env` file (create if needed): `VITE_API_URL=http://localhost:5000`
- Or the default in `frontend/src/api/client.js` will be used

