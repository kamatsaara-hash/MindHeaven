# Quick Start Guide - MindHaven

## ⚡ 5-Minute Setup

### Windows Users
```powershell
# Run in PowerShell
.\setup.ps1
```

### Mac/Linux Users
```bash
# Run in terminal
bash setup.sh
```

## 🚀 Manual Setup (If Auto Setup Doesn't Work)

### 1. Backend Setup
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start PostgreSQL with Docker
docker run -d \
  --name mindhaven-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=mindhaven \
  -p 5432:5432 \
  postgres:15

# Wait 5 seconds for database to start
sleep 5

# Seed sample data (optional)
python seed.py

# Start server
python main.py
```

**Backend running at:** `http://localhost:8000`
**API Docs at:** `http://localhost:8000/docs`

### 2. Frontend Setup (New Terminal)
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend running at:** `http://localhost:5173`

## 🎯 First Steps

1. **Visit the app:** Open http://localhost:5173
2. **Explore as guest:** Click "Continue as Guest" on landing page
3. **Browse community:** Go to Community tab to see sample posts
4. **View resources:** Check Resources page for educational content
5. **Check dashboard:** View analytics on Dashboard page

## 📝 Environment Setup

### Backend (.env)
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mindhaven
SECRET_KEY=dev-secret-key-change-in-production
DEBUG=True
CORS_ORIGINS=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## 🔧 Troubleshooting

### PostgreSQL Connection Failed
```bash
# Check if PostgreSQL is running
docker ps | grep mindhaven-db

# If not running, start it
docker run -d \
  --name mindhaven-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=mindhaven \
  -p 5432:5432 \
  postgres:15
```

### Backend Won't Start
```bash
# Check if port 8000 is in use
# Windows
netstat -ano | findstr :8000

# Mac/Linux
lsof -i :8000

# If in use, kill the process or use different port
```

### Frontend Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📚 File Structure Reference

**Frontend Pages:**
- `/` - Landing page
- `/community` - Community posts
- `/resources` - Educational content
- `/professional-help` - Counselors
- `/dashboard` - Analytics
- `/profile` - User profile
- `/settings` - Settings

**Backend API:**
- `/auth/*` - Authentication
- `/posts/*` - Posts and comments
- `/resources/*` - Resources
- `/health` - Health check

## 🎨 Customize Colors

Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  lavender: { 500: '#8b52ff' },      // Change primary color
  'pastel-blue': { 400: '#0ea5e9' }, // Change secondary
  'soft-teal': { 400: '#14b8a6' },   // Change accent
  'baby-pink': { 500: '#ec4899' },   // Change highlight
}
```

## 📊 Database

### View Database
```bash
# Connect to PostgreSQL
psql -U postgres -d mindhaven -h localhost

# Common commands
\dt              # List tables
\d users         # Describe users table
SELECT * FROM users;  # Query data
```

### Reset Database
```bash
# Drop and recreate
dropdb mindhaven
createdb mindhaven

# Seed new data
python backend/seed.py
```

## 🚢 Production Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment guide

Quick Docker deploy:
```bash
docker-compose up -d
```

## ❓ Common Questions

**Q: Can I run both on same machine?**
A: Yes! Frontend on port 5173, Backend on port 8000, Database on port 5432

**Q: How do I add new posts?**
A: Use the Community page's "Share Your Story" button

**Q: How do I add resources?**
A: Backend endpoint only for now. Use API docs at http://localhost:8000/docs

**Q: Can I customize the UI?**
A: Yes! All styling uses Tailwind CSS in component files

**Q: How do I change colors?**
A: Edit `frontend/tailwind.config.js` theme colors

## 🔐 Authentication

**Login Methods:**
- Guest (anonymous)
- Email/Password signup
- Admin login (on login page)

**Test Credentials:**
- Email: test@example.com
- Password: password123

## 📞 Need Help?

- Check logs in terminal
- Review `.env` configuration
- Check browser console for errors
- See README.md for detailed guide
- Check DEPLOYMENT.md for production setup

## ✅ Verification Checklist

- [ ] PostgreSQL running (port 5432)
- [ ] Backend starts (port 8000)
- [ ] Frontend starts (port 5173)
- [ ] API docs accessible (/docs)
- [ ] Can visit landing page
- [ ] Can login as guest
- [ ] Can view community posts
- [ ] Can view resources

---

**Ready to launch! 🚀**

Once everything is running, share with friends and start building!
