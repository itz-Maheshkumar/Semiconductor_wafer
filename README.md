# Semiconductor Wafer Defect Detection System

AI-powered defect detection for semiconductor wafers with real-time predictions, batch processing, and interactive analytics.

## 📋 Table of Contents

- [Features](#-features)
- [System Requirements](#-system-requirements)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Sample Data](#-sample-data)
- [Configuration](#-configuration)
- [Troubleshooting](#-troubleshooting)
- [Production Deployment](#-production-deployment)

---

## ✨ Features

| Feature | Status |
|---------|--------|
| 🔐 JWT Authentication with Signup/Login | ✅ Ready |
| 🎨 User Profile Management | ✅ Ready |
| 📸 Single Image Inspection | ✅ Ready |
| 📦 Batch Processing (Multiple Images) | ✅ Ready |
| 📊 Prediction Analytics & Dashboard | ✅ Ready |
| 📋 Inspection History with Details | ✅ Ready |
| 💬 User Feedback System | ✅ Ready |
| 🔒 Encrypted Database | ✅ Ready |
| 🌙 Dark Mode UI | ✅ Ready |
| ⚙️ Settings & Preferences | ✅ Ready |

---

## 💻 System Requirements

### Minimum Requirements
- **Python**: 3.10+ (for backend)
- **Node.js**: 18.0+ (for frontend)
- **npm**: 9.0+
- **RAM**: 4GB minimum (8GB recommended for ML model)
- **Disk Space**: 2GB free (for model and database)

### Operating Systems Supported
- ✅ **Linux** (Ubuntu 20.04+, Debian 11+)
- ✅ **macOS** (10.15+, Intel or Apple Silicon)
- ✅ **Windows** (10/11 with WSL2 or native)

---

## 🔧 Installation

### 1️⃣ System Prerequisites

#### **Linux (Ubuntu/Debian)**
```bash
# Update package manager
sudo apt update && sudo apt upgrade -y

# Install Python and development tools
sudo apt install -y python3.10 python3.10-venv python3-pip python3-dev

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install build tools (for SQLcipher)
sudo apt install -y build-essential libssl-dev libffi-dev
```

#### **macOS (Intel/Apple Silicon)**
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python and Node.js
brew install python@3.10 node

# Verify installations
python3 --version
node --version
npm --version
```

#### **Windows (Native or WSL2)**

**Option A: Using WSL2 (Recommended)**
```powershell
# In PowerShell (Admin)
wsl --install -d Ubuntu-22.04

# Inside WSL2 terminal (Ubuntu)
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3.10 python3.10-venv python3-pip python3-dev build-essential libssl-dev libffi-dev
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

**Option B: Native Windows Installation**
1. Download and install **Python 3.10+** from [python.org](https://www.python.org/downloads)
   - ✅ Check "Add Python to PATH"
   - ✅ Check "Install pip"
2. Download and install **Node.js 20+** from [nodejs.org](https://nodejs.org)
   - ✅ Includes npm automatically
   - ✅ Add to PATH when prompted

3. Verify installations in Command Prompt:
```cmd
python --version
node --version
npm --version
```

### 2️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/Semiconductor_wafer.git
cd Semiconductor_wafer
```

### 3️⃣ Backend Setup

#### All Platforms
```bash
# Navigate to backend
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# Linux/macOS:
source venv/bin/activate
# Windows (CMD):
venv\Scripts\activate
# Windows (PowerShell):
venv\Scripts\Activate.ps1

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# .env file is already created - verify configuration
cat .env                              # Linux/macOS
type .env                             # Windows

# Edit .env with your settings (change JWT_SECRET_KEY and DB_PASSWORD)
# Linux/macOS: nano .env  or  vi .env
# Windows: notepad .env

# Verify installation
python -m uvicorn app.main:app --help
```

### 4️⃣ Frontend Setup

#### All Platforms
```bash
# Navigate to frontend (in new terminal)
cd frontend

# Install dependencies
npm install

# Create .env.local file
# Linux/macOS:
echo "VITE_API_BASE_URL=http://localhost:8000" > .env.local
# Windows (CMD):
echo VITE_API_BASE_URL=http://localhost:8000 > .env.local
# Windows (PowerShell):
"VITE_API_BASE_URL=http://localhost:8000" | Out-File .env.local

# Verify installation
npm run dev --help
```

---

## 🚀 Quick Start

### Start Backend Server

```bash
cd backend

# Activate virtual environment
# Linux/macOS:
source venv/bin/activate
# Windows (CMD):
venv\Scripts\activate
# Windows (PowerShell):
venv\Scripts\Activate.ps1

# Start server
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Database initialized
INFO:     Demo users seeded
```

### Start Frontend Dev Server

```bash
# In another terminal
cd frontend
npm run dev
```

**Output:**
```
VITE v5.0.0  ready in XXX ms

➜  Local:   http://localhost:5173/
```

### Access Application

1. Open browser: **http://localhost:5173**
2. Login with demo account:
   - **Email**: `engineer@fab.com`
   - **Password**: `password123`
3. Or create a new account via signup page

---

## 📁 Project Structure

```
.
├── backend/                          # FastAPI backend
│   ├── app/
│   │   ├── main.py                 # Application entry point
│   │   ├── db.py                   # Database configuration
│   │   ├── seed_demo.py            # Auto-seed demo data
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── auth.py         # Authentication endpoints
│   │   │       ├── predictions.py  # Prediction endpoints
│   │   │       ├── analytics.py    # Analytics endpoints
│   │   │       └── feedback.py     # Feedback endpoints
│   │   ├── core/
│   │   │   ├── jwt.py              # JWT utilities
│   │   │   └── password.py         # Password hashing
│   │   ├── models/                 # SQLModel ORM models
│   │   ├── schemas/                # Pydantic schemas
│   │   └── ml/
│   │       └── inference.py        # ML prediction logic
│   ├── requirements.txt             # Python dependencies
│   ├── .env                         # Environment config (git ignored)
│   └── .env.example                 # Example configuration
│
├── frontend/                         # React frontend
│   ├── src/
│   │   ├── main.jsx                # Vite entry point
│   │   ├── App.jsx                 # Root component
│   │   ├── components/             # Reusable components
│   │   ├── pages/                  # Page components
│   │   ├── services/               # API services
│   │   └── routes/                 # Route definitions
│   ├── package.json                # npm dependencies
│   ├── vite.config.js              # Vite configuration
│   ├── .env.local                  # Frontend config (git ignored)
│   └── index.html                  # HTML template
│
├── images/                          # Sample test images
│   ├── images.jpeg                 # Sample wafer image 1
│   └── images1.jpeg                # Sample wafer image 2
│
├── docs/                            # Documentation
│   ├── 01_PROJECT_OVERVIEW.md
│   ├── 02_API_CONTRACT.md
│   ├── 03_MODEL_TRAINING.md
│   ├── 04_REPO_STRUCTURE.md
│   └── planning/                   # Planning documents
│
└── README.md                        # This file
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/v1/auth/signup           # Register new user
POST   /api/v1/auth/login            # Login user
GET    /api/v1/auth/me               # Get current user profile
PUT    /api/v1/auth/me               # Update user profile
```

### Predictions
```
POST   /api/v1/predictions           # Upload image & predict
GET    /api/v1/predictions           # List all predictions
GET    /api/v1/predictions/{id}      # Get prediction details
POST   /api/v1/predictions/{id}/feedback  # Submit feedback
```

### Analytics
```
GET    /api/v1/analytics/summary     # Dashboard statistics
```

---

## 📸 Sample Data

The repository includes **sample wafer images** in the `images/` folder for testing:
- `images.jpeg` - Sample semiconductor wafer image 1
- `images1.jpeg` - Sample semiconductor wafer image 2

Use these to test the inspection functionality without needing real wafer scans.

---

## ⚙️ Configuration

### Backend Configuration (`.env`)

```env
# JWT Token Settings
JWT_SECRET_KEY=your-secure-random-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440

# Database Encryption
DB_PASSWORD=change-this-to-secure-password
DB_PATH=./app.db

# ML Model
MODEL_PATH=../models/downloads/wafer_pretrained.keras

# Environment
ENVIRONMENT=development  # development | production
```

### Frontend Configuration (`.env.local`)

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## 🔍 Troubleshooting

### Backend Issues

**"Module not found" error**
```bash
cd backend
pip install --upgrade pip
pip install -r requirements.txt
```

**"Port 8000 already in use"**
```bash
# Linux/macOS: Find and kill process
lsof -i :8000
kill -9 <PID>

# Windows: Find and kill process
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**"Database locked" error**
```bash
# Linux/macOS:
rm backend/app.db
# Windows:
del backend\app.db
# Restart backend to re-seed
```

**"Python: command not found" on macOS**
```bash
# Use full path or set alias
/usr/local/bin/python3 --version
# Or add to ~/.zshrc:
alias python3=/usr/local/bin/python3
```

### Frontend Issues

**"npm: command not found"**
```bash
# Verify Node.js is installed
node --version

# Reinstall Node.js from nodejs.org
```

**"Cannot find module" in node_modules**
```bash
rm -rf node_modules package-lock.json
npm install
```

**"Cannot reach backend" / CORS errors**
```bash
# Verify backend is running on port 8000
# Check VITE_API_BASE_URL in .env.local matches backend
# Should be: http://localhost:8000
```

### Windows-Specific Issues

**"Python is not recognized" (native Windows)**
- Reinstall Python with "Add Python to PATH" checked
- Or use full path: `C:\Python310\python.exe`

**"venv\Scripts\Activate.ps1 cannot be loaded"**
```powershell
# Set execution policy temporarily
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**PowerShell vs CMD**
- Use `CMD` if you have permission issues
- Or prefix commands with `python -m` (platform-independent)

---

## 🚀 Production Deployment

### Pre-Deployment Checklist

1. **Change Secrets**
   ```bash
   # Generate secure JWT key
   python3 -c "import secrets; print(secrets.token_urlsafe(32))"
   ```
   - Update `JWT_SECRET_KEY` in `.env`
   - Update `DB_PASSWORD` in `.env`

2. **Database Migration**
   - Switch from SQLite to PostgreSQL (recommended)
   - Run database migrations
   - Update `DATABASE_URL` in `.env`

3. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   # Output in dist/ folder
   ```

4. **Backend Server**
   ```bash
   # Install production server
   pip install gunicorn

   # Run with Gunicorn
   gunicorn -w 4 -b 0.0.0.0:8000 app.main:app
   ```

5. **Security**
   - Enable HTTPS only
   - Set `ENVIRONMENT=production`
   - Configure CORS origins properly
   - Use environment-specific secrets

---

## 📚 Documentation

Full documentation available in the `docs/` folder:
- **01_PROJECT_OVERVIEW.md** - Architecture and design
- **02_API_CONTRACT.md** - Detailed API specifications
- **03_MODEL_TRAINING.md** - ML model details
- **04_REPO_STRUCTURE.md** - Complete repository structure

---

## 👥 Demo Accounts

Auto-seeded on first startup:
- **Email**: `engineer@fab.com` | **Password**: `password123`
- **Email**: `test@fab.com` | **Password**: `test123`

---

## 📝 License

This project is proprietary software for Semiconductor Wafer Defect Detection.

## ✅ Status

- Backend: ✅ Production Ready
- Frontend: ✅ Production Ready
- Database: ✅ Encrypted & Secure
- API: ✅ Fully Integrated
- Documentation: ✅ Complete

---

**Last Updated**: July 2026  
**Version**: 1.0.0 - Production Ready
