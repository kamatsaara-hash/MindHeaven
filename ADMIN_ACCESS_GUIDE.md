# Admin Dashboard Access Guide

## 🚀 Quick Start

Both servers should be running:
- **Frontend**: http://localhost:5174 (running ✓)
- **Backend**: http://localhost:8000 (running ✓)

## 🔐 Admin Login Credentials

**Email**: `admin@gmail.com`
**Password**: `admin 123`

## 📍 How to Access

### Step 1: Navigate to Admin Portal
1. Go to http://localhost:5174/admin/login
2. Or from the main page, click the admin link if available

### Step 2: Enter Credentials
- Email: `admin@gmail.com`
- Password: `admin 123`

### Step 3: Access Dashboard
After login, you'll have access to:

## 📊 Admin Dashboard Features

### Dashboard Page (`/admin`)
- **Statistics Cards**: 
  - Total Users
  - Active Users
  - Verified Counselors
  - Appointments Today
  - Reported Posts
  - High Risk Users
  
- **Charts**:
  - User Growth (Area Chart - 12 months)
  - Risk Distribution (Pie Chart)
  - Topic Engagement (Bar Chart - Top 5 topics)

### User Management (`/admin/users`)
- View all platform users
- Create new users
- Block/Unblock users
- Delete users
- Filter and search functionality

### Counselor Management (`/admin/counselors`)
- View all counselors
- Search by name, email, or specialization
- Filter by status (All, Verified, Pending)
- View counselor profiles with:
  - Rating and reviews
  - Sessions completed
  - Specializations
  - Contact information
- Approve/Reject pending counselors
- Create new counselors
- Update counselor information
- Delete counselors

### Other Management Pages
- **Community Moderation**: Review reported posts and comments
- **Crisis Monitoring**: Track high-risk users
- **Appointments**: View and manage counselor appointments
- **Content Management**: Manage posts and resources
- **Analytics**: View detailed platform analytics
- **Notifications**: Send notifications to users
- **Resources & Helplines**: Manage helpline information
- **Reports**: Generate platform reports
- **Feedback & Support**: View user feedback
- **Settings**: Admin panel settings

## 📱 User Pages (Not Logged In)

### Professional Help Page
- Browse all verified counselors
- Filter by specialization
- View counselor details and availability
- View emergency helplines

### Community Page
- View all posts
- Participate in discussions
- Comment on posts

### Resources Page
- Access mental health resources
- View helpline information

## ✅ Verification Checklist

- [ ] Frontend dev server running on port 5174
- [ ] Backend API running on port 8000
- [ ] Can access http://localhost:5174/admin/login
- [ ] Can login with admin@gmail.com / admin 123
- [ ] Dashboard shows statistics and charts
- [ ] Can access User Management page
- [ ] Can access Counselor Management page
- [ ] Can see counselor data in the table

## 🐛 Troubleshooting

### If dashboard is blank:
1. Check browser console (F12) for errors
2. Verify backend is running: http://localhost:8000/docs
3. Check network tab to see if API calls are succeeding
4. Check backend logs for errors

### If login doesn't work:
1. Verify you're using: `admin@mindhaven.com` and `admin123`
2. Check browser console for errors
3. Verify backend is running

### If "Not Authenticated" appears:
1. Clear browser cache and localStorage
2. Log out and log back in
3. Try a different browser

## 📧 Test Users (for reference)

Admin:
- Email: `admin@gmail.com`
- Password: `admin 123`

Counselors (Created):
- 8 counselors with verified/pending status
- Include specializations like Anxiety & Stress, Depression & Mood Disorders, etc.

Regular Users:
- Multiple users for testing
- Various risk levels (High, Medium, Low)

## 🔗 API Documentation

Backend Swagger UI: http://localhost:8000/docs

Key endpoints:
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - User list
- `GET /api/admin/counselors` - Counselor list
- `GET /api/public/counselors` - Public counselor list

## 💾 Database

MongoDB Database: `mindhaven`

Collections:
- users
- counselors
- posts
- comments
- appointments
- reports

## 📝 Notes

- Admin credentials are seeded in MongoDB
- All API calls are authenticated
- Dashboard data is calculated in real-time from MongoDB
- Charts update based on actual data in the database
