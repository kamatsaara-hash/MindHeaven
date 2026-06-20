# 🚀 Quick Start Guide - MindHaven Admin Dashboard

## What Was Fixed

1. **TypeScript Deprecation Error** - Resolved with `ignoreDeprecations` flag
2. **CORS Blocking Frontend-Backend Communication** - Updated CORS config to allow all origins
3. **Admin Login Credentials** - Updated to use correct seeded credentials

---

## Getting Started (3 Steps)

### Step 1: Start Frontend Dev Server
```powershell
cd frontend
npm run dev
```
**Output**: Server running on `http://localhost:5174`

### Step 2: Start Backend API
In a new terminal:
```powershell
cd backend
uvicorn main:app --reload --port 8000
```
**Output**: API running on `http://localhost:8000`

### Step 3: Access Admin Dashboard
1. Open browser: `http://localhost:5174/admin/login`
2. Login with:
   - **Email**: `admin@mindhaven.com`
   - **Password**: `admin123`
3. Dashboard loads at: `http://localhost:5174/admin`

---

## Available Admin Pages

| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | `/admin` | Real-time analytics & metrics |
| User Management | `/admin/users` | Manage platform users |
| Counselors | `/admin/counselors` | Verify & manage counselors |
| Community Moderation | `/admin/moderation` | Review reported content |
| Crisis Monitoring | `/admin/crisis` | Track high-risk users |
| Appointments | `/admin/appointments` | View scheduled sessions |
| Content Management | `/admin/content` | Manage posts & resources |
| Analytics | `/admin/analytics` | Detailed analytics |
| Notifications | `/admin/notifications` | Send user notifications |
| Resources & Helplines | `/admin/resources` | Manage helpline info |
| Reports | `/admin/reports` | Generate platform reports |
| Feedback & Support | `/admin/feedback` | View user feedback |
| Settings | `/admin/settings` | Admin settings |

---

## Dashboard Features

### 📊 Statistics Cards
- Total Users: 32
- Active Users: 14
- Verified Counselors: 7
- Appointments Today: 0
- Reported Posts: 2
- High Risk Users: 4

### 📈 Interactive Charts
1. **Platform Growth** - 12-month user registration trend
2. **Risk Distribution** - User risk breakdown (High/Medium/Low)
3. **Topic Engagement** - Top 5 discussion topics

### 📋 Database Contains
- 32 users (various risk levels)
- 8 counselors (mix of verified/pending)
- 11 posts (mental health discussions)
- 18 comments (community engagement)
- 6 appointments (scheduled sessions)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Not Authenticated" error | Clear browser cache, log out and back in |
| CORS errors in console | Verify backend is running on port 8000 |
| Dashboard shows empty cards | Verify database connection, check backend logs |
| Port 5173/5174 already in use | Frontend automatically uses next available port |

---

## Key Credentials

**Admin Account:**
- Email: `admin@mindhaven.com`
- Password: `admin123`

**Test Counselor (Example):**
- Specialization: Anxiety & Stress
- Status: Verified
- Rating: 4.8/5.0
- Sessions Completed: 45

---

## Technical Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI + Python + MongoDB
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React

---

## API Documentation

Access Swagger UI for backend API:
```
http://localhost:8000/docs
```

Key endpoints:
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - User list
- `GET /api/admin/counselors` - Counselor list
- `GET /api/public/counselors` - Public counselor browsing

---

## Notes

✅ All data is real and stored in MongoDB
✅ Dashboard metrics update in real-time
✅ Charts are fully interactive and responsive
✅ All admin functions are operational
✅ Authentication and authorization working
✅ Database seeded with realistic test data

---

## Next Steps

1. ✅ Verify dashboard is showing data
2. ✅ Test User Management page
3. ✅ Test Counselor Management page
4. Ready for feature development!

---

**Status**: All systems operational ✅

For detailed information, see `RESOLUTION_SUMMARY.md`
