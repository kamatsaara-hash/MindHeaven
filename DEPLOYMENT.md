# Deployment Guide for MindHaven

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Deployment Options](#deployment-options)
4. [Production Checklist](#production-checklist)

## Prerequisites

- Node.js 16+ (for frontend build)
- Python 3.9+ (for backend)
- PostgreSQL 12+ (production database)
- Docker & Docker Compose (optional)
- SSL Certificate (for HTTPS)
- Domain name

## Environment Setup

### 1. Database Setup (PostgreSQL)

#### Using Docker (Recommended)
```bash
docker run -d \
  --name mindhaven-db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=secure_password \
  -e POSTGRES_DB=mindhaven \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15-alpine
```

#### Manual Installation
```bash
# Create database and user
sudo -u postgres psql
CREATE USER mindhaven WITH PASSWORD 'secure_password';
CREATE DATABASE mindhaven OWNER mindhaven;
GRANT ALL PRIVILEGES ON DATABASE mindhaven TO mindhaven;
```

### 2. Backend Deployment

#### Using Gunicorn + Nginx

**Install Gunicorn:**
```bash
pip install gunicorn
```

**Create systemd service** (`/etc/systemd/system/mindhaven-api.service`):
```ini
[Unit]
Description=MindHaven API
After=network.target

[Service]
User=www-data
WorkingDirectory=/home/app/mindhaven_code/backend
Environment="PATH=/home/app/mindhaven_code/backend/venv/bin"
ExecStart=/home/app/mindhaven_code/backend/venv/bin/gunicorn \
  -w 4 \
  -b 0.0.0.0:8000 \
  --access-logfile - \
  --error-logfile - \
  app.main:app

[Install]
WantedBy=multi-user.target
```

**Enable and start:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable mindhaven-api
sudo systemctl start mindhaven-api
```

#### Environment Variables
Create `/etc/environment` or use `.env`:
```
DATABASE_URL=postgresql://mindhaven:secure_password@localhost:5432/mindhaven
SECRET_KEY=your_super_secret_key_min_32_chars_long
DEBUG=False
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 3. Frontend Deployment

#### Build for Production
```bash
cd frontend
npm run build
```

This creates an optimized `dist/` folder.

#### Using Nginx

**Create Nginx config** (`/etc/nginx/sites-available/mindhaven`):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Frontend
    location / {
        root /var/www/mindhaven/frontend/dist;
        try_files $uri /index.html;
    }

    # Backend API proxy
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Enable and reload:**
```bash
sudo ln -s /etc/nginx/sites-available/mindhaven /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. SSL Certificate (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com
```

## Deployment Options

### Option 1: AWS EC2 + RDS

**EC2 Setup:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y python3-pip python3-venv nodejs npm nginx postgresql-client

# Clone repository
cd /home/ubuntu
git clone https://github.com/yourusername/mindhaven.git
cd mindhaven
```

**RDS Database:**
- Create PostgreSQL RDS instance
- Update `DATABASE_URL` in environment

**Deploy:**
```bash
# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
gunicorn -w 4 -b 0.0.0.0:8000 app.main:app &

# Frontend
cd ../frontend
npm install
npm run build
sudo cp -r dist/* /var/www/mindhaven/
```

### Option 2: Docker + Docker Compose

**Create docker-compose.prod.yml:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: mindhaven
    volumes:
      - postgres_prod:/var/lib/postgresql/data

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/mindhaven
      SECRET_KEY: ${SECRET_KEY}
      DEBUG: "False"
    depends_on:
      - postgres
    ports:
      - "8000:8000"

  frontend:
    build: ./frontend
    ports:
      - "3000:80"

volumes:
  postgres_prod:
```

**Deploy:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Option 3: Heroku

**Procfile:**
```
web: gunicorn -w 4 -b 0.0.0.0:$PORT app.main:app
```

**Deploy:**
```bash
heroku login
heroku create mindhaven-app
git push heroku main
```

## Production Checklist

- [ ] Set `DEBUG=False` in environment
- [ ] Generate strong `SECRET_KEY` (min 32 chars)
- [ ] Configure CORS origins correctly
- [ ] Set up database backups
- [ ] Enable SSL/HTTPS
- [ ] Configure firewall rules
- [ ] Set up monitoring and logs
- [ ] Configure email for notifications
- [ ] Set up rate limiting
- [ ] Enable database connection pooling
- [ ] Configure CDN for static assets
- [ ] Set up automated backups
- [ ] Configure health checks
- [ ] Set up alerting
- [ ] Review security headers

## Monitoring & Logging

### Backend Logs
```bash
# Using systemd
sudo journalctl -u mindhaven-api -f

# Using Docker
docker logs -f mindhaven_backend
```

### Database Backups
```bash
# Automatic daily backup
0 2 * * * pg_dump -U mindhaven mindhaven | gzip > /backups/mindhaven_$(date +\%Y\%m\%d).sql.gz
```

### Application Monitoring
```bash
# Install APM tool (e.g., New Relic, DataDog)
pip install newrelic
```

## Performance Optimization

1. **Database Optimization:**
   - Add indexes to frequently queried columns
   - Enable connection pooling

2. **Frontend Optimization:**
   - Enable compression (gzip)
   - Use CDN for static assets
   - Optimize images

3. **Backend Optimization:**
   - Use caching (Redis)
   - Implement pagination
   - Enable database query caching

## Troubleshooting

### Database Connection Issues
```bash
# Test connection
psql -h localhost -U mindhaven -d mindhaven
```

### Backend Not Starting
```bash
# Check logs
journalctl -u mindhaven-api -n 50

# Restart service
sudo systemctl restart mindhaven-api
```

### Frontend Not Loading
```bash
# Check Nginx config
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

## Security Best Practices

1. Keep dependencies updated
2. Use environment variables for secrets
3. Enable HTTPS/TLS
4. Implement rate limiting
5. Use strong database passwords
6. Regular security audits
7. Monitor for suspicious activity
8. Keep backups encrypted
9. Use VPN for database access
10. Implement input validation

## Support

For deployment issues, refer to:
- FastAPI: https://fastapi.tiangolo.com/deployment/
- React: https://create-react-app.dev/deployment/
- PostgreSQL: https://www.postgresql.org/docs/
- Nginx: https://nginx.org/en/docs/

---

Happy deploying! 🚀
