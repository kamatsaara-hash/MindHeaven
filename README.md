# MindHaven - Mental Health Awareness & Support Platform

A modern, full-stack mental health support platform with anonymous community features, educational resources, and professional guidance. Built with React, TypeScript, Vite, FastAPI, and PostgreSQL.

## Features

### Frontend
- **Beautiful UI**: Glassmorphism design with soft gradients and smooth animations
- **Anonymous Community**: Share experiences without revealing identity
- **Educational Resources**: Articles, videos, infographics, and tips
- **Professional Help**: Connect with verified counselors and therapists
- **Dashboard**: Analytics and trending topics
- **Dark/Light Mode**: Theme toggle for user preference
- **Responsive Design**: Mobile-first approach for all devices

### Backend
- **FastAPI**: High-performance Python API framework
- **PostgreSQL**: Robust database with migrations
- **JWT Authentication**: Secure user authentication
- **REST API**: Well-documented API endpoints
- **Scalable Architecture**: Modular and maintainable code structure

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (fast build tool)
- Tailwind CSS
- Framer Motion (animations)
- Recharts (charts)
- Lucide React (icons)

### Backend
- FastAPI 0.104.1
- SQLAlchemy 2.0
- PostgreSQL 12+
- Alembic (migrations)

## Getting Started

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
createdb mindhaven
python main.py
```

## Project Structure

```
mindhaven_code/
├── frontend/
│   ├── src/
│   │   ├── components/     # UI and layout components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── routers/        # API endpoints
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   ├── database/       # DB config
│   │   └── auth/           # JWT utilities
│   ├── alembic/            # Migrations
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
│
└── README.md
```

## Environment Setup

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8000/api
```

### Backend (.env)
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/mindhaven
SECRET_KEY=your-secret-key-change-in-production
DEBUG=True
```

## API Endpoints

- `POST /auth/signup` - Register
- `POST /auth/login` - Login
- `POST /auth/guest` - Guest login
- `GET /posts` - List posts
- `POST /posts` - Create post
- `GET /resources` - List resources
- `POST /resources` - Create resource

## Database

Run migrations:
```bash
cd backend
alembic upgrade head
```

## Development

### Frontend
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run lint` - Lint code

### Backend
- `python main.py` - Start server
- `pytest` - Run tests

## Color Palette

- **Lavender**: #8b52ff
- **Pastel Blue**: #0ea5e9
- **Soft Teal**: #14b8a6
- **Baby Pink**: #ec4899

## Features Implemented

✅ Landing page with hero section
✅ Community support page with anonymous posts
✅ Resources page with educational content
✅ Professional help page with counselors
✅ Dashboard with analytics
✅ User profile page
✅ Settings page
✅ Dark/light mode
✅ Responsive design
✅ FastAPI backend with all endpoints
✅ Database models and migrations
✅ JWT authentication
✅ Beautiful UI with Tailwind + Framer Motion

## Future Enhancements

- AI chatbot support
- Real-time notifications
- WebSocket for live updates
- Multilingual support
- Mobile app
- Advanced analytics

## License

MIT License

---

**Made with ❤️ for mental wellness**
